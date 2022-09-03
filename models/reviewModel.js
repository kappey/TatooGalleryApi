const mongoose = require('mongoose');
const Joi = require('joi');

// Review Schema
const reviewSchema = new mongoose.Schema({
    content:String,
    date_created:{
        type:Date, default:Date.now()
    }
});
exports.ReviewModel =  mongoose.model("categories" , reviewSchema);

// Check valid Review
exports.validReview= (_reviewBody) => {
    let JoiSchema = Joi.object({
        content:Joi.string().min(1).required(),
    })
    return JoiSchema.validate(_reviewBody);
};