const express = require ('express');
const router = express.Router();

/* GET Home page. */
router.get('/', (req, res) => {
    res.json({msg: 'express Works'});
});

module.exports = router;