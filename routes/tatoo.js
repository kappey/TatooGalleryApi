const express = require('express');

const { authToken } = require("../middleware/auth");
const { UserModel } = require('../models/userModel');
const { TattooModel, validTattoo } = require('../models/tattooModel');


const router = express.Router();

/* GET all tattoos. */
router.get('/', async (req, res) => {
    let qSearch = req.query.s;
    let qRegExp = new RegExp(qSearch, "i");
    let perPage = (req.query.pp) ? Number(req.query.pp) : 10;
    let page = req.query.p;
    let sortQ = (req.query.sort) ? (req.query.sort) : "_id";
    let ifReverse = (req.query.r == "y") ? -1 : 1;
  
    try {
      let data = await TattooModel.find()
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
  
  /* GET all tattoos by Category */
  router.get("/:categoryID", async (req, res) => {
    let category_id_tattoo = req.params.categoryID;
    try {
        let data = await TattooModel.find({category_id:category_id_tattoo})
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
  });


 /* Add new tattoo */
 router.post("/", authToken, async (req, res) => {
    let validBody = validTattoo(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let tattoo = new TattooModel(req.body);
        // let user = await UserModel.findById(req.userData._id);

        await tattoo.save();
        res.status(201).json(tattoo);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});


/* Like / Unlike tattoo */
router.put("/like/:tattooID", authToken,  async (req, res) =>{
   try{ 
        let tattoo = await TattooModel.findById(req.params.tattooID);
        let user = await UserModel.findById(req.userData._id);

       if(!tattoo.likes.includes(user.person_id)){
           await tattoo.updateOne({$push: {likes: user.person_id}});
           res.status(200).json("liked");
       }else{
           await tattoo.updateOne({$pull: {likes: user.person_id}});
           res.status(200).json("unliked");
       }
    }catch (error){
        res.status(500).json(error);
        
    }
})

 /* Edit tattoo */
router.put("/:tattooEditID",  authToken, async (req, res) => {
    let id_tattoo_edit = req.params.tattooEditID;
    let validBody = validTattoo(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let itemEdit = await TattooModel.updateOne({ _id: id_tattoo_edit }, req.body);
        res.json(itemEdit);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

/* Delete tattoo */
router.delete("/:tattooDeleteID", authToken, async (req, res) => {
    let delete_id = req.params.tattooDeleteID;
    try {
        let itemDelete = await TattooModel.deleteOne({ _id: delete_id /*, user_id: req.userData._id */  });
        res.json(itemDelete);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

module.exports = router;