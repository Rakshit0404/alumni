const mongoose=require('mongoose');

const comments=new mongoose.Schema({
    commentName:String,
    commentText:String
})

const blogs=new mongoose.Schema({
    bloggerName:String,
    blogText:String,
    comments:[comments],
    upvotes:Number
})

const blogSchema=new mongoose.Schema({
    name:String,
    blogs:[blogs]
})

module.exports=mongoose.model('Blog',blogSchema);