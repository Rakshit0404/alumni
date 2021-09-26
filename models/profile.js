const  mongoose=require('mongoose');
const schema=mongoose.Schema;

const UserprofileSchema=new schema({
    username:String,
    fullname:String,
    email:{
        type:String,
        required:true,
        unique:true
     },
    mobileno:String,
    predes:String,
    addrs:String,
    school:String,
    course:String,
    dep:String,
    notable:String,
    image:[{
        url:String,
        filename:String
    }]
})

module.exports=mongoose.model('Userpro',UserprofileSchema);