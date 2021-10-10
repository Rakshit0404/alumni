if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express=require('express');
const path = require('path');
const app=express();
const ejsmate=require('ejs-mate');
const mongoose=require('mongoose');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
const LocalStratergy = require('passport-local');
const userRoutes=require('./routes/user');
const User=require('./models/user');
const ExpressError=require('./utils/ExpressError');
const catchAsync=require('./utils/catchAsync');
const userproRoutes=require('./routes/userpro')
const Blog=require('./models/blogs');
const Blogtype=require('./models/blogtype');
const Comments=require('./models/comments');
const methodOverride = require('method-override');


mongoose.connect('mongodb://localhost:27017/alumni', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once('open', () => {
    console.log("Database connected");
});


//middelware
app.engine('ejs',ejsmate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'views/layouts')));
app.use(express.static(path.join(__dirname,'uploads')));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use((session(sessionConfig)));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/',(req,res)=>{
  res.render('layouts/home');
})

app.use('/',userRoutes)

app.use("/",userproRoutes)

const fs = require('fs-extra');
var fileUpload = require('express-fileupload');
var mime = require('mime');
app.use(fileUpload({}));
const array=require('./models/array');
const { findById } = require('./models/user');


app.get('/blogs/:corner',async(req,res,next)=>{
    console.log(req.params.corner);
    var corner=await Blogtype.find({name:req.params.corner}).populate({
      path:'blogs',
      populate:{
        path:'bloggerName'
      }
    }).populate('bloggerName')
    if(corner.length==0)
    {
      let naya=await new Blogtype({name:req.params.corner});
      corner.push(naya);
      await naya.save();
    }
    corner=corner[0];
    res.render('alumni/blogtype',{corner});
})

app.get('/blogs/:corner/writeblog',(req,res)=>{
  const {corner}=req.params;
  res.render('alumni/writeblog',{corner});
})

app.get('/blogs',(req,res)=>{
    res.render("alumni/blog.ejs");
})

app.get('/blogs/:corner/:id',async (req,res)=>{
    const{id,corner}=req.params;
    const user=req.user._id;
    const blog= await Blog.findById({_id:id}).populate({
      path:'bloggerName',
      populate:{
        path:'comments'
      }
    }).populate({
      path:'comments',
      populate:{
        path:'commentName'
      }
    }).populate('commentName');
    res.render("alumni/viewblog",{blog,corner,user});
})

app.get('/:corner/:id/updateblog',async (req,res)=>{
  const{id,corner}=req.params;
    const blog= await Blog.findById({_id:id}).populate({
      path:'bloggerName'
    })
    res.render("alumni/updateblog",{blog,corner});
})

app.post('/upload', function (req, res) {
    var folderName = path.join(__dirname, `uploads`);
    console.log(folderName);
    if (!fs.existsSync(folderName)) {
      fs.mkdir(folderName, function (err) {
        if (err) {
          console.log(err);
        }
        else {
          console.log("error");
        }
      });
    }
    else {
      if (!req.files) {
        return res.status(400).send('No files were uploaded.');
      }
      // console.log(req.files.file.mimetype);
      // console.log(req.files.file.data.byteLength);
      var sampleFile = req.files.file;
      sampleFile.mv(path.join(__dirname, 'uploads','blogimages', req.files.file.name), function (err) {
        var temp = path.join(__dirname, 'uploads','blogimages', req.files.file.name);
        mime.lookup(path.join(__dirname, 'uploads','blogimages', req.files.file.name)); 
        // console.log(temp);        // => 'text/plain'
        if (err) {
          return res.status(500).send(err);
        }
        if(!(array[req.user._id]))
        {
          array[req.user._id]=[];
        }
        array[req.user._id].push(req.files.file.name);
        // console.log(array[req.user._id]);
        // console.log(req.user);
        res.send({ 'location': `../../blogimages/${req.files.file.name}`});
    });
  }
});

app.get('/uploadtemp',(req,res)=>{
  res.render("alumni/writeblogtemp");
})

app.post('/tempupload',(req,res)=>{
  const {filenames}= req.body;
  var divide=filenames.split("|");
  console.log(divide);
  function diffArray(arr1, arr2) {
    return arr1
      .concat(arr2)
      .filter(item => !arr1.includes(item) || !arr2.includes(item));
  }
  var diff=diffArray(array[req.user._id],divide);
  console.log(diff);
  for(let d of diff)
  {
    fs.unlinkSync(`./uploads/blogimages/${d}`);
  }
  delete array[req.user._id];
  console.log(array);
});

app.post('/blogs/:corner',async (req,res)=>{
    const {corner}=req.params; 
    var banda=await User.find({email:req.user.email});
    banda=banda[0];
    const newpost=await new Blog({blogText:req.body.content,bloggerName:banda});
    const requiredtype= await Blogtype.findOne({name:corner});
    requiredtype.blogs.unshift(newpost);
    await newpost.save();
    await requiredtype.save();
    res.redirect(`/blogs/${corner}`);
})

app.post('/blogs/:corner/upload',async (req,res)=>{
  const {corner}=req.params; 
  var banda=await User.find({email:req.user.email});
  banda=banda[0];
  var post=await Blog.find({_id:req.body.identify});
  post=post[0];
  post.blogText=req.body.content;
  await post.save();
  res.redirect(`/blogs/${corner}`);
})

app.post('/comment',async (req,res)=>{
    var user= await User.find({_id:req.user._id});
    user=user[0];
    let newcomment= await new Comments({commentName:user, commentText:req.body.comment});
    newcomment.save();
    var bloggerName= await Blog.findById({_id:req.body.blogger});
    console.log(bloggerName);
    bloggerName.comments.unshift(newcomment);
    bloggerName.save();
    console.log(newcomment);
})

app.post('/update',async (req,res)=>{
    var str=(req.body).string;
    var newarray=str.split("|");
    array[req.user._id]=newarray;
    console.log(array);
})

app.post('/deleteblog/:corner',async (req,res)=>{
    const {corner}=req.params;
    console.log(corner);
    var newarray=req.body.string.split("|");
    console.log(newarray);
    for(let i=0;i<newarray.length-1;i++)
    {
        let d=newarray[i];
        fs.unlinkSync(`./uploads/blogimages/${d}`);
    }
    await Blog.deleteOne({_id:req.body.blogid});
})

app.post('/like',async (req,res)=>{
  console.log(req.body);
  const blog=await Blog.findById({_id:req.body.string});
  blog.upvotes=blog.upvotes+1;
  console.log(blog);
})

app.get('/contactus',(req,res)=>{
    res.render("alumni/contactus");
})

app.get('/edits',(req,res)=>{
    res.render('layouts/edit');
})

app.all('*',(req,res,next)=>{
     next(new ExpressError('Page Not Found',404));
})

app.use((err,req,res,next)=>{
    const {statusCode = 500 } = err;
    if(!err.message) err.message="Something Went Wrong ";
    res.status(statusCode).render('error',{err});
})

app.listen('3000',()=>{
console.log("listening to port 3000");
})