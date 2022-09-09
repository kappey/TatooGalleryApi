const express = require('express');

const { authToken } = require("../middleware/auth");
const { UserModel } = require('../models/userModel');
const { ReviewModel, validReview } = require('../models/reviewModel');


const router = express.Router();

/* GET all reviews. */
router.get('/', /*authToken,*/ async (req, res) => {
    let qSearch = req.query.s;
    let qRegExp = new RegExp(qSearch, "i");
    let perPage = (req.query.pp) ? Number(req.query.pp) : 20;
    let page = req.query.p;
    let sortQ = (req.query.sort) ? (req.query.sort) : "_id";
    let ifReverse = (req.query.r == "y") ? -1 : 1;
  
    try {
      let data = await ReviewModel.find()
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
  
  /* GET all reviews by ID */
  router.get("/:personID", authToken, async (req, res) => {
    let person_id_review = req.params.personID;
    try {
        let data = await ReviewModel.find({person_id:person_id_review})
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
  });


 /* Create a new review */
 router.post("/", authToken, async (req, res) => {
    let validBody = validReview(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let review = new ReviewModel(req.body);
        let user = await UserModel.findById(req.userData._id);
        
        review.person_id = user.person_id;

        await review.save();
        res.status(201).json(review);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});


/* Like / Unlike review */
router.put("/like/:reviewID", authToken,  async (req, res) =>{
    try{ 
         let review = await ReviewModel.findById(req.params.reviewID);
         let user = await UserModel.findById(req.userData._id);
 
        if(!review.likes.includes(user.person_id)){
            await review.updateOne({$push: {likes: user.person_id}});
            res.status(200).json("liked");
        }else{
            await review.updateOne({$pull: {likes: user.person_id}});
            res.status(200).json("unliked");
        }
     }catch (error){
         res.status(500).json(error);
         
     }
 })

 /* Edit review */
router.put("/:reviewEditID",  authToken, async (req, res) => {
    let id_review_edit = req.params.reviewEditID;
    let validBody = validReview(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let itemEdit = await ReviewModel.updateOne({ _id: id_review_edit, person_id: req.userData._id }, req.body);
        res.json(itemEdit);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

/* Delete review */
router.delete("/:reviewDeleteID", authToken, async (req, res) => {
    let deleteID = req.params.reviewDeleteID;
    try {
        let itemDelete = await ReviewModel.deleteOne({ _id: deleteID /*, user_id: req.userData._id */  });
        res.json(itemDelete);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

module.exports = router;