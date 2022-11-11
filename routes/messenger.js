const express = require('express');
const { authToken } = require("../middleware/auth");
const { UserModel } = require('../models/userModel');
const { MessengerModel, validMessanger } = require('../models/messengerModel');


const router = express.Router();

/* GET all messengers. */
router.get('/', async (req, res) => {
    let qSearch = req.query.s;
    let qRegExp = new RegExp(qSearch, "i");
    let perPage = (req.query.pp) ? Number(req.query.pp) : 10;
    let page = req.query.p;
    let sortQ = (req.query.sort) ? (req.query.sort) : "_id";
    let ifReverse = (req.query.r == "y") ? -1 : 1;
  
    try {
      let data = await MessengerModel.find()
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

/* GET Messenger by ID */
router.get("/:personID", authToken, async (req, res) => {
    let _id = req.params.personID;
    try {
        let data = await MessengerModel.findOne({person_id:_id})
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
  });

/* Delete messenger */
router.delete("/:messengerDeleteID", authToken, async (req, res) => {
    let delete_id = req.params.blogDeleteID;
    try {
        let itemDelete = await MessengerModel.deleteOne({ _id: delete_id /*, user_id: req.userData._id */  });
        res.json(itemDelete);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

module.exports = router;