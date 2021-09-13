const Joi=require('joi');

module.exports.userprofileSchema = Joi.object({
    user: Joi.object({
        username: Joi.string().required(),
        fullname: Joi.string().required(),
        email: Joi.string(),
        mobileno:Joi.string().max(12).min(10),
        presentdesignation: Joi.string(),
        address: Joi.string(),
        school: Joi.string(),
        course: Joi.string(),
        department: Joi.string()


    }).required(),
    deleteImages: Joi.object()
})