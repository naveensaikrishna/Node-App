var express = require('express');
var router = express.Router();
var path = require('path')

/* GET connections listing. */
router.get('/', (req,res) => {
  
  res.sendFile(path.join(__dirname,"/../views/connections.html"))
});

module.exports = router;