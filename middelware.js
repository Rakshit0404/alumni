const ExpressError =require('./utils/ExpressError');
const user=require('./models/user');

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error','You Must Login ');
        return res.redirect('/login');
    }
    next();
}

