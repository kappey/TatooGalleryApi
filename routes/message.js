const express = require('express');
const { authToken } = require("../middleware/auth");
const { UserModel } = require('../models/userModel');
const { MessageModel, validMessage } = require('../models/messageModel');


const router = express.Router();

/* GET all messages by ID. */
router.get('/', async (req, res) => {
    let qSearch = req.query.s;
    let qRegExp = new RegExp(qSearch, "i");
    let perPage = (req.query.pp) ? Number(req.query.pp) : 10;
    let page = req.query.p;
    let sortQ = (req.query.sort) ? (req.query.sort) : "_id";
    let ifReverse = (req.query.r == "y") ? -1 : 1;
  
    try {
      let data = await MessageModel.find()
      .sort({ [sortQ]: ifReverse })
          .limit(perPage)
          .skip(page * perPage-perPage)
      res.json(data);
    }
    catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  });

/* GET all messages by ID */
router.get("/:messageID", authToken, async (req, res) => {
    let message_id = req.params.messageID;
    try {
        let data = await MessageModel.find({_id:message_id})
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
  });
  
 /* Add a new message */
 router.post("/", authToken, async (req, res) => {
    let validBody = validMessage(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let message = new MessageModel(req.body);
        let user = await UserModel.findById(req.userData._id);
        message.sender_id = user.person_id;
        await message.save();
        res.status(201).json(blog);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

/* Delete message */
router.delete("/:messageDeleteID", authToken, async (req, res) => {
    let delete_id = req.params.blogDeleteID;
    try {
        let itemDelete = await MessageModel.deleteOne({ _id: delete_id /*, user_id: req.userData._id */  });
        res.json(itemDelete);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

module.exports = router;