const mongoose = require('mongoose');
const Joi = require('joi');

// Review Schema
const reviewSchema = new mongoose.Schema({
    person_id:String,
    content:String,
    image_id: String,
    likes: {
        type: Array, default:[]
    },
    date_created:{
        type:Date, default:Date.now()
    }
});
exports.ReviewModel =  mongoose.model("reviews" , reviewSchema);

// Check valid Review
exports.validReview= (_reviewBody) => {
    let JoiSchema = Joi.object({
        person_id:Joi.string().min(1).required(),
        content:Joi.string().min(1).required(),
        image_id:Joi.string().min(1).required()
    })
    return JoiSchema.validate(_reviewBody);
};