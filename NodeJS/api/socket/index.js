var express = require('express');
var router = express.Router();
var controller = require('./controler');


router.post("/push", controller.pushNotice);
router.get("/listMacOnline", controller.getConnectedDevides);
router.get("/listDevices", controller.listDevices);

module.exports = router;