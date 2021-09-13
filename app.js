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
const Blog=require('./models/blog');
// const multer=require('multer');
// const {storage}=require('./cloudinary');
// const upload=multer({storage});
// const upload=require('./uploads/multer');
// const cloudinary=require('cloudinary').v2;
const fs = require('fs-extra');
var fileUpload = require('express-fileupload');
var mime = require('mime');
app.use(fileUpload({}));
const array=require('./models/array');

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
    if(!['/login','/'].includes(req.originalUrl)){
        req.session.returnTo=req.originalUrl;
    }else{
        req.session.returnTo='/'; 
    }
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.get('/',(req,res)=>{
    // res.send("<h1>home page</h1>");
    res.render('layouts/home');
})

app.get('/blogs/:corner',async(req,res,next)=>{
    const corner=await Blog.findOne({name:req.params.corner});
    console.log(corner.name);
    res.render('alumni/blogtype',{corner});
})

app.get('/blogs/:corner/writeblog',(req,res)=>{
    res.render('alumni/writeblog');
})

app.get('/blogs',(req,res)=>{
    res.render("alumni/blog.ejs");
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
        console.log(array[req.user._id]);
        console.log(req.user);
        res.send({ 'location': `../../blogimages/${req.files.file.name}`});
    });
  }
});

app.get('/uploadtemp',(req,res)=>{
  res.render("alumni/writeblogtemp");
})

app.post('/tempupload',(req,res)=>{
  console.log("hiii");
  const {filenames}= req.body;
  var divide=[];
  var str="";
  const size=filenames.length;
  for(let i=0;i<size;i++)
  {
    if(filenames[i]=="|")
    {
      divide.push(str);
      str="";
    }
    else{
      str+=filenames[i];
    }
  }
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
});

app.post('/blogs',(req,res)=>{
    var {content}=req.body;

    content="<div style='width:600px; height:auto;'>"+content+"</div>";
    res.send(content);
})

app.get('/contactus',(req,res)=>{
    res.render("alumni/contactus");
})

app.get('/edits',(req,res)=>{
    res.render('layouts/edit')
})

app.use('/',userRoutes)


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