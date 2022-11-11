const mongoose = require('mongoose');
const Joi = require('joi');

const blogSchema = new mongoose.Schema({
    blogContent:String,
    person_id:String,
    images:{
        type: Array, default:[]
    },
    likes: {
        type: Array, default:[]
    },
    comments: {
        type: Array, default:[]
    },
    date_created:{
        type:Date, default:Date.now()
    }
});


exports.BlogModel = mongoose.model("blogs" , blogSchema);

exports.validBlog= (_blogBody) => {
    let JoiSchema = Joi.object({
        person_id:Joi.string().min(1),
        blogContent:Joi.string().min(1).required(),
        images:Joi.string(),
        likes:Joi.array(),
        comments:Joi.array()
    })

    return JoiSchema.validate(_blogBody);
};