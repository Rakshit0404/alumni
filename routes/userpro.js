const express=require('express');
const router=express.Router();
const Userpro=require('../models/profile');
const {validateuser,isLoggedIn}=require('../middelware');
const catchAsync = require('../utils/catchAsync');
const multer  = require('multer')
const {storage}=require('../cloudinary_config')
const { cloudinary } = require("../cloudinary_config");
const upload = multer({ storage })
const Cloudinary = require('cloudinary').v2;


router.get('/userprofile',isLoggedIn,(req,res)=>{
    res.render('userpf/profile');
})



router.post('/userprofile',  upload.array('image') , validateuser , catchAsync(async(req,res)=>{
    console.log(req.body,req.files);
    const userpro=new Userpro(req.body.user);
    userpro.images=req.files.map(f=>({url:f.path , filename:f.filename}))
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

router.get('/editprofile/:email_p',isLoggedIn,async(req,res)=>{
   
    const {email_p}=req.params;
    const user=await Userpro.findOne({email : email_p })
    // console.log("in edit")
    // console.log(user);
    // console.log(user.addrs)
    
    res.render('userpf/editpro',{user});
})

router.put('/editprofile/:email_p',upload.array('image'),async(req,res)=>{
    // console.log(req.body);
    const {email_p}=req.params;
    const User=await Userpro.findOne({email: email_p });
    const id=User._id;
    const user=await Userpro.findByIdAndUpdate(id,{...req.body.user});
    const img=req.files.map(f => ({url:f.path , filename:f.filename}));
    user.images.push(...img);
    await user.save();
    console.log(req.body.deleteImages);
    if (req.body.deleteImages) {
       
        for (let filename of req.body.deleteImages) {
            console.log(filename);
            // await cloudinary.uploader.destroy(filename);
            Cloudinary.uploader.destroy(filename);
        }
        await user.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(user);
    }
    res.send('hooray');
})

module.exports=router;

