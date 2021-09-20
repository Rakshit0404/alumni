const mongoose=require('mongoose');

const Blog=require('./blogs');

const blogSchema=new mongoose.Schema({
    name:String,
    blogs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Blog'
    }]
})

module.exports=mongoose.model('Blogtype',blogSchema);