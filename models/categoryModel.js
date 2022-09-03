const mongoose = require('mongoose');
const Joi = require('joi');

// Category Schema
const categorySchema = new mongoose.Schema({
    categoryName:String,
    date_created:{
        type:Date, default:Date.now()
    }
});
exports.CategoryModel =  mongoose.model("categories" , categorySchema);

// Check valid Category
exports.validCategory= (_categoryBody) => {
    let JoiSchema = Joi.object({
        categoryName:Joi.string().min(1).required(),
    })
    return JoiSchema.validate(_categoryBody);
};