const ExpressError =require('./utils/ExpressError');
const user=require('./models/user');
const {userprofileSchema}=require('./schema.js');


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error','You Must Login ');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateuser=(req,res,next)=>{
     const { error }=userprofileSchema.validate(req.body);
     if(error){
         const msg=error.details.map(el=>el.message).join(',')
         throw new ExpressError(msg,400)

     }
     else next()
}


