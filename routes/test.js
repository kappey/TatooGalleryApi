const express = require ('express');
const router = express.Router();

/* GET Home page. */
router.get('/', (req, res) => {
    res.json({msg: 'test Works'});
    console.log("Inside Test");
});

module.exports = router;