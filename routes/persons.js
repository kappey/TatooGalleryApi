const express = require('express');
const router = express.Router();
const { authToken } = require("../middleware/auth");
const { PersonModel, validPerson } = require("../models/personModel");

/* GET all Persons */
// router.get('/', authToken, async (req, res, next) => {
router.get('/', async (req, res, next) => {
  let qSearch = req.query.s;
  let qRegExp = new RegExp(qSearch, "i");
  let perPage = (req.query.pp) ? Number(req.query.pp) : 50;
  let page = req.query.p;
  let sortQ = (req.query.sort) ? (req.query.sort) : "date_created";
  let ifReverse = (req.query.r == "y") ? -1 : 1;

  try {
    let data = await PersonModel.find({isActive:true, $or: [{ firstName: qRegExp }, { lastName: qRegExp }, { currentLocation: qRegExp }, { email: qRegExp }]})
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

/* GET Person by ID */
// router.get("/:personID", authToken, async (req, res) => {
router.get("/:personID", async (req, res) => {
  let person_id = req.params.personID;
  try {
      let data = await PersonModel.findOne({_id:person_id})
      res.json(data);
  }
  catch (err) {
      console.log(err);
      res.status(400).json(err);
  }
});

/* Edit Person */
router.put("/:editID", async (req, res) => {
  let idEedit = req.params.editID;
  let validBody = PersonModel(req.body);
  if (validBody.error) {
      return res.status(400).json(validBody.error.details);
  }
  try {
      let itemEdit = await PersonModel.updateOne({ _id: idEedit}, req.body);
      res.json(itemEdit);
  }
  catch (err) {
      console.log(err);
      res.status(400).json(err);
  }
});

module.exports = router;