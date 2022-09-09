const express = require('express');
const router = express.Router();
const { authToken } = require("../middleware/auth");
const { CategoryModel, validCategory } = require("../models/categoryModel");

/* GET all Ctegories */
router.get('/', async (req, res) => {
  let qSearch = req.query.s;
  let qRegExp = new RegExp(qSearch, "i");
  let sortQ = (req.query.sort) ? (req.query.sort) : "date_created";
  let ifReverse = (req.query.r == "y") ? -1 : 1;

  try {
    let data = await CategoryModel.find()
        .sort({ [sortQ]: ifReverse })
    res.json(data);
}
catch (err) {
    console.log(err);
    res.status(400).json(err);
}
});

/* GET Ctegory by ID */
router.get("/:categoryID", async (req, res) => {
  let category_id = req.params.categoryID;
  try {
      let data = await CategoryModel.findOne({_id:category_id})
      res.json(data);
  }
  catch (err) {
      console.log(err);
      res.status(400).json(err);
  }
});

/* Create Category */
router.post('/',authToken, async(req,res) => {
    let validBody = validCategory(req.body);
    if (validCategory.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
        let category = new CategoryModel(req.body);
        await category.save();
        res.status(201).json(post);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

/* Edit Category */
router.put("/:editID", authToken, async (req, res) => {
  let edit_id = req.params.editID;
  let validBody = CategoryModel(req.body);
  if (validBody.error) {
      return res.status(400).json(validBody.error.details);
  }
  try {
      let edit_item = await CategoryModel.updateOne({ _id: edit_id}, req.body);
      res.json(edit_item);
  }
  catch (err) {
      console.log(err);
      res.status(400).json(err);
  }
});

/* Delete Category */
router.delete("/:deleteID", authToken, async (req, res) => {
    let delete_id = req.params.deleteID;
    try {
        let delete_item = await StatusModel.deleteOne({ _id: delete_id /*, user_id: req.userData._id */  });
        res.json(delete_item);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

module.exports = router;