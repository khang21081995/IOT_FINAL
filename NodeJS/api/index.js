var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/template', require('./template'));

module.exports = router;