if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}


const express = require('express');
const path = require('path');
const app = express();
const ejsmate = require('ejs-mate');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStratergy = require('passport-local');
const userRoutes = require('./routes/user');
const User = require('./models/user');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const userproRoutes = require('./routes/userpro');
const Blog = require('./models/blogs');
const Blogtype = require('./models/blogtype');
const Comments = require('./models/comments');
const methodOverride = require('method-override');
const Userpro=require('./models/profile');


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
app.engine('ejs', ejsmate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'views/layouts')));
app.use(express.static(path.join(__dirname, 'uploads')));

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


app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.get('/', async (req, res) => {
  var userNow = "Nothing";
  if(req.user)
  {
    userNow = await Userpro.find({email:req.user.email});
    if(userNow.length)
    {
      userNow = userNow[0];
    }
  }
  res.render('layouts/home',{userNow});
})

app.use('/', userRoutes)

app.use("/", userproRoutes)

app.get("/search",(req,res)=>{
  res.render('search/search')
})

app.post('/search',async(req,res)=>{
    console.log(req.body.search);
    const str=req.body.search.toLowerCase().trim();
    let user= await Userpro.find();
    user=checkString(user,str);
    console.log(user);
    res.send("searching");
})

function checkString(users,str){
    // let s=[];
    // users.forEach(user=>s.push(user.fullname));
    // let ans=[];
   return ( users.filter(user=>{
      return user.fullname.trim().toLowerCase().includes(str);
    })
   )
  }

const fs = require('fs-extra');
var fileUpload = require('express-fileupload');
var mime = require('mime');
app.use(fileUpload({}));
const array = require('./models/array');
const { findById } = require('./models/user');
const blogs = require('./models/blogs');


app.get('/blogs/:corner', async (req, res) => {
  const { index } = req.query;
  var corner = await Blogtype.find({ name: req.params.corner }).populate({
    path: 'blogs',
    populate: {
      path: 'bloggerName'
    }
  }).populate({
    path: 'bloggerName',
    populate: {
      path: 'comments'
    }
  }).populate('comments');
  if (corner.length == 0) {
    let naya = await new Blogtype({ name: req.params.corner });
    corner.push(naya);
    await naya.save();
  }
  let user=await Userpro.find({email: req.user.email});
  console.log(user);
  let alumnis = [];
  if(user.length)
  {
    alumnis = await Userpro.find({course: user[0].course});
    console.log(alumnis);
  }
  corner = corner[0];
  console.log(alumnis);
  const blognos = corner.blogs.length;
  corner = pagination(corner, index);
  console.log(corner.blogs.length);
  let blogtype = req.params.corner;
  res.render('alumni/blogtype', { corner, blogtype, user: req.user._id, index, blognos, alumnis });
})

app.get('/blogs/:corner/writeblog', (req, res) => {
  const { corner } = req.params;
  var now = new Date();
  var todays = now.getFullYear() + "-"+ now.getMonth() + "-" + now.getDate();
  if(!array[req.user._id])
  {
    array[req.user._id]={
      folderName:todays,
      images:[]
    }
  }
  console.log(array);
  res.render('alumni/writeblog', { corner });
})

app.get('/blogs', (req, res) => {
  res.render("alumni/blog.ejs");
})

app.get('/blogs/:corner/:id', async (req, res) => {
  const { id, corner } = req.params;
  const user = req.user._id;
  const blog = await Blog.findById({ _id: id }).populate({
    path: 'bloggerName',
    populate: {
      path: 'comments'
    }
  }).populate({
    path: 'comments',
    populate: {
      path: 'commentName'
    }
  }).populate('commentName');
  res.render("alumni/viewblog", { blog, corner, user });
})

app.get('/:corner/:id/updateblog', async (req, res) => {
  const { id, corner } = req.params;
  const blog = await Blog.findById({ _id: id }).populate({
    path: 'bloggerName'
  })
  console.log(blog);
  if(!array[req.user._id])
  {
    array[req.user._id]={
      folderName:blog.folderName,
      images:[]
    }
  }
  console.log(array);
  res.render("alumni/updateblog", { blog, corner });
})

app.post('/upload', function (req, res) {
  var direct=path.join(__dirname, `uploads`,`blogimages`,array[req.user._id].folderName);
  if (!fs.existsSync(direct)) {
    fs.mkdir(direct, function (err) {
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
  }
  var sampleFile = req.files.file;
  sampleFile.mv(path.join(__dirname, 'uploads', 'blogimages',array[req.user._id].folderName, req.files.file.name), function (err) {
    var temp = path.join(__dirname, 'uploads', 'blogimages',array[req.user._id].folderName, req.files.file.name);
    mime.lookup(path.join(__dirname, 'uploads', 'blogimages',array[req.user._id].folderName, req.files.file.name));
    if (err) {
      return res.status(500).send(err);
    }
    array[req.user._id].images.push(req.files.file.name);
    res.send({ 'location': `../../blogimages/${array[req.user._id].folderName}/${req.files.file.name}` });
  });
});

app.post('/tempupload', (req, res) => {
  const { filenames } = req.body;
  var divide = filenames.split("|");
  console.log(divide);
  var diff = diffArray(array[req.user._id].images, divide);
  console.log(diff);
  for (let d of diff) {
    fs.unlinkSync(`./uploads/blogimages/${array[req.user._id].folderName}/${d}`);
  }
  console.log(array);
});

app.post('/blogs/:corner', async (req, res) => {
  const { corner } = req.params;
  var banda = await User.find({ email: req.user.email });
  banda = banda[0];
  const newpost = await new Blog({ blogText: req.body.content, bloggerName: banda, folderName: array[req.user._id].folderName });
  const requiredtype = await Blogtype.findOne({ name: corner });
  requiredtype.blogs.unshift(newpost);
  await newpost.save();
  await requiredtype.save();
  delete array[req.user._id];
  console.log(array);
  res.redirect(`/blogs/${corner}?index=1`);
})

app.post('/blogs/:corner/updateblog', async (req, res) => {
  const { corner } = req.params;
  var banda = await User.find({ email: req.user.email });
  banda = banda[0];
  var post = await Blog.find({ _id: req.body.identify });
  post = post[0];
  post.blogText = req.body.content;
  await post.save();
  res.redirect(`/blogs/${corner}?index=1`);
})

app.post('/comment', async (req, res) => {
  var user = await User.find({ _id: req.user._id });
  user = user[0];
  let newcomment = await new Comments({ commentName: user, commentText: req.body.comment, blogId: req.body.blogger });
  newcomment.save();
  var bloggerName = await Blog.findById({ _id: req.body.blogger });
  console.log(bloggerName);
  bloggerName.comments.unshift(newcomment);
  bloggerName.save();
  console.log(newcomment);
})

app.post('/update', async (req, res) => {
  var str = (req.body).string;
  var newarray = str.split("|");
  array[req.user._id].images = newarray;
  console.log(array);
})

app.post('/deleteblog/:corner', async (req, res) => {
  const { corner } = req.params;
  console.log(corner);
  var newarray = req.body.string.split("|");
  console.log(newarray);
  for (let i = 0; i < newarray.length - 1; i++) {
    let d = newarray[i];
    fs.unlinkSync(`./uploads/blogimages/${req.body.folder}/${d}`);
  }
  await Comments.deleteMany({blogId:req.body.blogid});
  await Blog.deleteOne({ _id: req.body.blogid });
})

app.post('/like', async (req, res) => {
  console.log(req.body);
  const blog = await Blog.findById({ _id: req.body.blogid });
  if (include(blog.likes, req.body.userid)) {
    blog.likes = blog.likes.filter((ele) => {
      return ele != req.body.userid;
    })
  }
  else {
    blog.likes.push(req.body.userid);
  }
  blog.save();
})

app.post('/delcomment', async (req, res) => {
  await Comments.findByIdAndDelete({ _id: req.body.string });
  const blogdel = await Blog.findById({ _id: req.body.blogid });
  blogdel.comments.remove(req.body.string);
  blogdel.save();
})

app.get('/contactus', (req, res) => {
  res.render("alumni/contactus");
})

app.get('/edits', (req, res) => {
  res.render('layouts/edit');
})

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something Went Wrong ";
  res.status(statusCode).render('error', { err });
})

app.listen('3000', () => {
  console.log("listening to port 3000");
})
//extra functions
function include(arr, obj) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == obj) return true;
  }
}
//pagination
function pagination(model, index) {
  model.blogs = model.blogs.slice((index - 1) * 15, (index - 1) * 15 + 15);
  return model;
}

//photos delete
function diffArray(arr1, arr2) {
  return arr1
    .concat(arr2)
    .filter(item => !arr1.includes(item) || !arr2.includes(item));
}