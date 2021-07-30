const express=require('express');
const router=express.Router();
const User=require('../models/user');
const passport = require('passport');
const catchAsync=require('../utils/catchAsync')


router.get('/register',(req,res)=>{
    res.render('auth/register')
})

router.post('/register', catchAsync(async(req,res)=>{
    try{
        const {username , email , password }=req.body;
        //console.log(username, password,email);
        const user=new User({email,username});
        const newuser= await User.register(user,password);
        
        req.login(newuser ,e =>{
            if(e) return next(e);
            req.flash('succes',"welcome alumni !!");
            res.redirect('/');
        })
    } catch(e){
        req.flash('error',e.message);
        res.redirect('/');
    }
}))

router.get('/login',(req,res)=>{
    res.render('auth/login')
})

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','welcome back');
    res.redirect('/');
})

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success','Successfully Logged out');
    res.redirect('/');
})

module.exports=router;