const express = require('express');

const { authToken } = require("../middleware/auth");
const { UserModel } = require('../models/userModel');
const { BlogModel, validBlog } = require('../models/blogModel');


const router = express.Router();

/* GET all blogs. */
router.get('/', async (req, res) => {
    let qSearch = req.query.s;
    let qRegExp = new RegExp(qSearch, "i");
    let perPage = (req.query.pp) ? Number(req.query.pp) : 10;
    let page = req.query.p;
    let sortQ = (req.query.sort) ? (req.query.sort) : "_id";
    let ifReverse = (req.query.r == "y") ? -1 : 1;
  
    try {
      let data = await BlogModel.find()
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
  
 /* Add new blog */
 router.post("/", authToken, async (req, res) => {
    let validBody = validBlog(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let blog = new BlogModel(req.body);
        let user = await UserModel.findById(req.userData._id);
        blog.person_id = user.person_id;

        await blog.save();
        res.status(201).json(blog);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});


/* Like / Unlike blog */
router.put("/like/:blogID", authToken,  async (req, res) =>{
   try{ 
        let blog = await BlogModel.findById(req.params.blogID);
        let user = await UserModel.findById(req.userData._id);

       if(!blog.likes.includes(user.person_id)){
           await blog.updateOne({$push: {likes: user.person_id}});
           res.status(200).json("liked");
       }else{
           await blog.updateOne({$pull: {likes: user.person_id}});
           res.status(200).json("unliked");
       }
    }catch (error){
        res.status(500).json(error);
        
    }
})

 /* Edit blog */
router.put("/:blogEditID",  authToken, async (req, res) => {
    let id_blog_edit = req.params.blogEditID;
    let validBody = validBlog(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let itemEdit = await BlogModel.updateOne({ _id: id_blog_edit }, req.body);
        res.json(itemEdit);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

/* Delete blog */
router.delete("/:blogDeleteID", authToken, async (req, res) => {
    let delete_id = req.params.blogDeleteID;
    try {
        let itemDelete = await BlogModel.deleteOne({ _id: delete_id /*, user_id: req.userData._id */  });
        res.json(itemDelete);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

module.exports = router;