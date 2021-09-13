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

router.post('/userprofile',  upload.single('image') ,  validateuser , catchAsync(async(req,res)=>{
    console.log(req.body,req.file);
    //const userpro=new Userpro(req.body.user);
    //console.log(userpro);
    //await userpro.save();
    res.send('hooray');


}));

module.exports=router;