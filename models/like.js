const mongoose=require('mongoose');

const User=require('./user');
const Blog=require('./blogs');

const likeSchema=mongoose.Schema({
    likeName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    whichBlog:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Blog'
    }
})

module.exports = mongoose.model('Like',likeSchema);