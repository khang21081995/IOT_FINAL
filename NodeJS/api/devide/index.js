var express = require('express');
var router = express.Router();
var controller = require('./controler');
/* GET home page. */
// router.get('/hello', controller.hello);
// router.get('/bye', controller.byebye);

router.post('/', controller.addDevice);
router.put('/', controller.updateDevice);
router.post('/get', controller.get);

module.exports = router;