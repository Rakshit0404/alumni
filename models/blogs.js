const mongoose=require('mongoose');

const comments=require('./comments');
const User=require('./user');
const Like=require('./like');

const blogs=new mongoose.Schema({
    bloggerName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    blogText:String,
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comments'
    }],
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Like'
    }]
})

module.exports=mongoose.model('Blog',blogs);