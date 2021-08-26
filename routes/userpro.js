const express=require('express');
const router=express.Router();
const Userpro=require('../models/profile');
const {validateuser,isLoggedIn}=require('../middelware');
const catchAsync = require('../utils/catchAsync');


router.get('/userprofile',isLoggedIn,(req,res)=>{
    res.render('userpf/profile');
})

router.post('/userprofile',validateuser,catchAsync(async(req,res)=>{
    //console.log(req.body);
    const userpro=new Userpro(req.body.user);
    //console.log(userpro);
    await userpro.save();
    res.redirect('/');


}));

module.exports=router;