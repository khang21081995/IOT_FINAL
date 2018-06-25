var express = require('express');
var router = express.Router();
var controller = require('./controler');

/**
 * @swagger
 * /socket/push:
 *   post:
 *     tags:
 *       - Socket
 *     description: Send code to device via socket
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: info about device
 *         description: info about device want to send code.
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           example: {"key_event": "send","push_data":"135,9108,4392,680,450,678,452,680,1580,678,452,678,452,678,452,678,452,680,1578,680,450,678,452,678,1580,678,452,678,1580,678,1580,680,1580,678,1578,680,1578,678,1580,680,450,680,1578,680,452,678,452,678,452,678,450,678,452,678,452,678,1580,676,454,678,1578,680,1578,678,1580,678,1580,678,40872,9104,4394,678,452,678,452,678,1580,680,452,678,452,678,452,680,452,678,1578,680,452,678,452,678,1580,678,450,678,1580,678,1578,680,1578,680,1578,680,1578,680,1578,680,452,680,1578,678,452,678,452,678,452,678,452,678,452,678,452,678,1578,678,452,678,1580,678,1578,682,1576,680,1580,678","mac_address":"7e:e9:17:2d:e6:b4"}
 *     responses:
 *       200:
 *         description: thành công.
 *       400:
 *         description: Bad request.
 *       403:
 *         description: Schedule is existed.
 *       500:
 *         description: Lỗi chưa được xác định
 *       503:
 *         description: Dịch vụ không sẵn dùng
 */
router.post("/push", controller.pushNotice);


/**
 *** @swagger
 * /socket/listMacOnline:
 *   get:
 *     tags:
 *       - Socket
 *     description: Send code to device via socket
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: thành công.
 *       400:
 *         description: Bad request.
 *       403:
 *         description: Schedule is existed.
 *       500:
 *         description: Lỗi chưa được xác định
 *       503:
 *         description: Dịch vụ không sẵn dùng
 */
router.get("/listMacOnline", controller.getConnectedDevides);

/**
 * @swagger
 * /socket/listDevices:
 *   get:
 *     tags:
 *       - Socket
 *     description: Send code to device via socket
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: thành công.
 *       400:
 *         description: Bad request.
 *       403:
 *         description: Schedule is existed.
 *       500:
 *         description: Lỗi chưa được xác định
 *       503:
 *         description: Dịch vụ không sẵn dùng
 */
router.get("/listDevices", controller.listDevices);

module.exports = router;