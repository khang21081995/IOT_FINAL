var express = require('express');
var router = express.Router();
var controller = require('./controler');
/* GET home page. */
router.get('/hello', controller.hello);
router.get('/bye', controller.byebye);

module.exports = router;
