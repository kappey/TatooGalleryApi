const mongoose = require('mongoose');
const Joi = require('joi');

// TattooSchema
const tattooSchema = new mongoose.Schema({
    category_id:String,
    title:String,
    person_id:String,
    image_id: String,
    likes: {
        type: Array, default:[]
    },
    date_created:{
        type:Date, default:Date.now()
    }
});
exports.TattooModel =  mongoose.model("tattoos" , tattooSchema);

// Check valid Tattoo
exports.validTattoo= (_tattooBody) => {
    let JoiSchema = Joi.object({
        category_id:Joi.string().min(1),
        title:Joi.string().min(1).required(),
        image_id:Joi.string().min(1),
        person_id:Joi.string().min(1)
    })
    return JoiSchema.validate(_tattooBody);
};