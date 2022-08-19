const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const minDOB = new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 18);

exports.genSignInToken = (_id) => {
  let token = jwt.sign({_id},process.env.jwtSecret);
  return token;
}

exports.genForgotPasswordToken = (_id) => {
  let token = jwt.sign({_id},process.env.jwtSecret,{expiresIn:"10mins"});
  return token;
}

// User Schema
const userSchema = new mongoose.Schema({
    person_id:String,
    password:String,
    changePasswordToken:String,
    forgotPasswordDate:Date,
    date_created:{
      type:Date, default:Date.now
  }
});
exports.UserModel =  mongoose.model("users" , userSchema);

// Check valid SignUp
exports.validSignUp = (_userBody) => {
    let joiSchema = Joi.object({
        firstName:Joi.string().min(3).max(200).required(),
        lastName:Joi.string().min(3).max(200).required(),
        email:Joi.string().min(10).max(100).email().required(),
        address:Joi.string().min(3).max(200).required(),
        city:Joi.string().min(3).max(30).required(),
        country:Joi.string().min(3).max(30).required(),
        state:Joi.string().min(3).max(30),
        language:Joi.string().min(3).max(10),
        phoneNumber:Joi.string().min(3).max(15).required(),
        dob:Joi.date().max(minDOB).required(),
        password:Joi.string().min(3).max(200).required(),
        latitude:Joi.number(),
        longitude:Joi.number(),
    })
    return joiSchema.validate(_userBody);
  }

  // Check valid SignIn
  exports.validSignIn = (_userBody) => {
    let joiSchema = Joi.object({
      email:Joi.string().min(10).max(100).email().required(),
      password:Joi.string().min(3).max(200).required(),
    })
    return joiSchema.validate(_userBody);
  }

   // Check valid Forgot Password
  exports.validForgotPassword = (_userBody) => {
    let joiSchema = Joi.object({
      email:Joi.string().min(10).max(100).email().required()
    })
    return joiSchema.validate(_userBody);
  }

    // Check valid Reset Passwords
  exports.validResetPasswords = (_userBody) => {
    let joiSchema = Joi.object({
      password:Joi.string().min(3).max(200).required()
      // להעניס אימות סיסמה
    })
    return joiSchema.validate(_userBody);
  }