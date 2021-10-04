const Joi=require('joi');

module.exports.userprofileSchema = Joi.object({
    user: Joi.object({
        username: Joi.string().required(),
        fullname: Joi.string().required(),
        email: Joi.string(),
        mobileno:Joi.string().max(12).min(10),
        predes: Joi.string(),
        addrs: Joi.string(),
        school: Joi.string(),
        course: Joi.string(),
        dep: Joi.string()


    }).required(),
    deleteImages: Joi.object()
})