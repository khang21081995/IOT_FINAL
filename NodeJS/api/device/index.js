var express = require('express');
var router = express.Router();
var controller = require('./controler');



/**
 * @swagger
 * /device:
 *   post:
 *     tags:
 *       - Devices
 *     description: Add Device
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Add device
 *         description: info about device want to add
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           example: {"mac":"1a:2b:3c:4d:5e:6f","name":"Phòng ngủ 1"}
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
router.post('/', controller.addDevice);

/**
 * @swagger
 * /device:
 *   put:
 *     tags:
 *       - Devices
 *     description: Update Devices
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Update Devices
 *         description: info about device want to update
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           example: {"mac":"1a:2b:3c:4d:5e:6f","name":"Phòng ngủ 1"}
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
router.put('/', controller.updateDevice);


/**
 * @swagger
 * /device/get:
 *   post:
 *     tags:
 *       - Devices
 *     description: get Devices by list of mac address
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: info about device
 *         description: info about device want to get
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           example: {"macList": ["1a:2b:3c:4d:5e:6f","6a:6b:6c:6d:5f:2a"]}
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
router.post('/get', controller.get);

module.exports = router;