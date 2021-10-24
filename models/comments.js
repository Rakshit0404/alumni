const mongoose=require('mongoose');

const User=require('./user');

const comments=new mongoose.Schema({
    commentName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    commentText:String,
    blogId:String
})

module.exports=mongoose.model('Comments',comments);