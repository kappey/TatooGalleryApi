const mongoose = require('mongoose');
const Joi = require('joi');

// Person Schema
const personSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String,
    address:String,
    city:String,
    country:String,
    state:String,
    latitude: Number, 
    longitude:Number,
    phoneNumber:String,
    language:String,
    dob:Date,
    isAdmin:{
        type:Boolean, default:false
    },
    date_created:{
        type:Date, default:Date.now()
    }
});
exports.PersonModel =  mongoose.model("persons" , personSchema);

// Check valid Person
exports.validPerson= (_personBody) => {
    let JoiSchema = Joi.object({
        firstName:Joi.string().min(1).required(),
        lastName:Joi.string().min(1).required(),
        email:Joi.string().min(3).max(200).email().required(),
        address:Joi.string().min(3).max(200),
        city:Joi.string().min(3).max(200),
        state:Joi.string().min(3).max(200),
        language:Joi.string().min(3).max(200),
        phoneNumber:Joi.string().min(3).max(10),
        longitude:Joi.number().required(),
        latitude:Joi.number().required(),
        dob:Joi.date().required()
    })
    return JoiSchema.validate(_personBody);
};