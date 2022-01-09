var express = require('express');
var router = express.Router();
var path = require('path')

/* GET schemas listing. */
router.get('/', (req,res) => {

  res.sendFile(path.join(__dirname,"/../views/schemas.html"))
});

module.exports = router;