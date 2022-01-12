var express = require('express');
var router = express.Router();
var path = require('path')

let configController = require('../controllers/config.js')

/* GET connections listing. */
router.get('/', (req,res) => {
  
  res.sendFile(path.join(__dirname,"/../views/config.html"))
});

router.post('/save-configurations',configController.saveConfigurations)

module.exports = router;

