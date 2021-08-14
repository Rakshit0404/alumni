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
    res.render('layouts/home')
})

app.get('/contactus',(req,res)=>{
    res.render("alumni/contactus")
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
    if(!err.message) err.message="Something Went Wrong "
    res.status(statusCode).render('error',{err})
})

app.listen('3000',()=>{
console.log("listening to port 3000");
})