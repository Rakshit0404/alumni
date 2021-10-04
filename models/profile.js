const  mongoose=require('mongoose');
const schema=mongoose.Schema;

// https://res.cloudinary.com/dvjhcld2c/image/upload/w_270,h_270,c_fill/v1631638529/alumni/rqqgdxjvijxz2vzxxgu6.jpg


const ImageSchema = new schema({
    url:String,
    filename:String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_270,h_270,c_fill');
});



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
    image:[ImageSchema]
})

module.exports=mongoose.model('Userpro',UserprofileSchema);