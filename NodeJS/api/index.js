var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/template', require('./template'));
router.use('/socket', require('./socket'));
router.use('/device', require('./device'));
router.use('/code', require('./code'));

module.exports = router;
