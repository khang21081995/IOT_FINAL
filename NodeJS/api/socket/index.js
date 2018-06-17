var express = require('express');
var router = express.Router();
var controller = require('./controler');


router.post("/push", controller.pushNotice);
router.get("/listConnectedDevices", controller.getConnectedDevides);

module.exports = router;