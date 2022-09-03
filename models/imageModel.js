const mongoose = require('mongoose');
const Joi = require('joi');

// Image Schema
const imageSchema = new mongoose.Schema({
    person_id:String,
    imagePath: String,
    date_created:{
        type:Date, default:Date.now()
    }
});
exports.ImageModel =  mongoose.model("images" , imageSchema);

// Check valid Image
exports.validImage= (_imageBody) => {
    let JoiSchema = Joi.object({
        person_id:Joi.string().min(1).required(),
        imagePath:Joi.string().min(1).required()
    })
    return JoiSchema.validate(_imageBody);
};