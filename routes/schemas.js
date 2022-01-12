var express = require('express');
var router = express.Router();
var path = require('path')


let schemasController = require('../controllers/schemas.js')

/* GET schemas listing. */
router.get('/', (req,res) => {
  res.sendFile(path.join(__dirname,"/../views/schemas.html"))
});

router.get('/get-all-schemas',schemasController.getAllSchemas);
router.get('/get-columns',schemasController.getColumns);

router.post('/add-new-schema', schemasController.createSchema);

module.exports = router;

