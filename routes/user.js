const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require("jsonwebtoken");
// const sendEmail = require('../utils/sendEmail');


const { authToken } = require('../middleware/auth');
const { UserModel, validSignIn, validSignUp, validForgotPassword,validResetPasswords, genForgotPasswordToken, genSignInToken } = require('../models/userModel');
const { PersonModel, validPerson } = require('../models/personModel');

/* SIGN UP */
router.post('/signup', async (req, res) => {
  let validBody = validSignUp(req.body);
  if (validBody.error) {
      return res.status(400).json(validBody.error.details);
  }
  try {
      let person = new PersonModel(req.body);
      await person.save();
      let user = new UserModel();
      let salt = await bcrypt.genSalt(10);
      user.person_id = person._id;
      user.password = await bcrypt.hash(req.body.password, salt);
      await user.save();
      res.status(201).json(_.pick(person, ['firstName', 'lastName']));
  }
  catch (err) {
      console.log(err);
      res.status(400).json(err);
  }
});

/* SIGN IN */
router.post('/signIn',async(req,res) => {
  let validBody = validSignIn(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try{
    let person = await PersonModel.findOne({email:req.body.email});
    if(!person){
      return res.status(400).json({msg:"user or password is invalid"});
    }
    let user = await UserModel.findOne({person_id:person._id});
    let validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword){
      return res.status(400).json({msg:"user or password is invalid"});  
    }
    let userToken = genSignInToken(user._id);
    res.json({token:userToken, personID: user.person_id});
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

/* Valid users token ?????*/
router.get('/', authToken, async (req, res) => {
  try {
    let user = await UserModel.findById(req.userData._id);
    res.json(user);
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});


// /* Forgot password */
// router.put('/resetPassword', async(req,res) => {
//   let validEmail = validForgotPassword(req.body);
//   if (validEmail.error) {
//     return res.status(400).json(validEmail.error.details);
//   }
//   try{
//     let person = await PersonModel.findOne({email:req.body.email});
//     if(!person){
//       return res.status(400).json({msg:"User does not exist"});
//     }
//     let user = await UserModel.findOne({traveler_id:traveler._id});

//     let passwordToken = genForgotPasswordToken(user._id);
//     await UserModel.updateOne( {_id:user._id} ,{changePasswordToken: passwordToken});
  
//     const link = `${process.env.BASE_URL}/users/setNewPassword/${user._id}/${user.changePasswordToken}`;
//     console.log(link);
//     await sendEmail(req.body.email, "Reset password" , link);
  
//     res.json({message: "email sent successfully"});
//   }
//   catch (err) {
//     console.log(err);
//     res.status(400).json(err);
//   }
// });

/* Change password */
router.put('/setNewPassword/:userID/:token', async (req, res) => {
  let userID = req.params.userID;
  let userToken = req.params.token;
  let validBody = validResetPasswords(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let decodeToken = jwt.verify(userToken, config.jwtSecret);
    req.userData = decodeToken;
    let salt = await bcrypt.genSalt(10);
    let password = await bcrypt.hash(req.body.password, salt);
    await UserModel.updateOne( {_id:userID} ,{password: password});
    res.json({msg:"ok"});
  }
  catch (err) {
    console.log(err);
    res.status(400).json({ msg: "link is invalid or expired"});
  }
});

// //Deactivate user
// router.put('/deleteUser/:id', authToken, async (req, res) => {
//   let userID = req.params.id;
//   try {
//       let userDelete = await TravelerModel.updateOne( {_id:userID} ,{isActive: false});
//       res.json(userDelete);
//   }
//   catch (err) {
//       console.log(err);
//       res.status(400).json(err);
//   }
// });

module.exports = router;