const express=require('express');
const router=express.Router();
const Userpro=require('../models/profile');
const {validateuser,isLoggedIn}=require('../middelware');
const catchAsync = require('../utils/catchAsync');
const multer  = require('multer')
const {storage}=require('../cloudinary_config')

const upload = multer({ storage })



router.get('/userprofile',isLoggedIn,(req,res)=>{
    res.render('userpf/profile');
})

router.post('/userprofile',  upload.array('i') , validateuser , catchAsync(async(req,res)=>{
    console.log(req.body,req.files);
    const userpro=new Userpro(req.body.user);
    userpro.image=req.files.map(f=>({url:f.path , filename:f.filename}))
    // console.log(images)
    console.log(userpro);
    await userpro.save();
    res.send('hooray');
}));

router.get('/viewprofile/:email_p', isLoggedIn ,async(req,res)=>{
     const {email_p}=req.params
    //console.log(email_p);
     const user= await Userpro.findOne({email : email_p });
     console.log(user);
     res.render('userpf/viewprofile',{user})
})
module.exports=router;

