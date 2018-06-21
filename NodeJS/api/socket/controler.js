var request = require('request');

function pushNotice(req, res) {
    var io = require('../../socketIO/socketServer').io;
    var keyEvent = (req.body.key_event + "").trim();
    var pushData = req.body.push_data;
    var mac = req.body.mac_address;

    if (require('../../socketIO/socketServer').mapConnectedClient.get(mac)) {
        io = require('../../socketIO/socketServer').mapConnectedClient.get(mac);
    }


    if (keyEvent !== 'undefined' && pushData) {
        io.emit(keyEvent, pushData);
        if (res)
            res.status(200).json({
                status: true,
                message: "push data success to devices listening at event " + keyEvent
            });
    } else {
        if (res)
            res.status(400).json({
                status: false,
                message: "Invalid input"
            });
    }
}

var REQ = {
    body: {
        key_event: "MACregistration",
        push_data: "refresh list devices"
    }
};

setInterval(function () {
    pushNotice(REQ);
}, 10 * 1000 * 60);

function getConnectedDevides(req, res) {

    var b = [];

    var mapDevide = require('../../socketIO/socketServer').mapConnectedClient;
    var iter = mapDevide.keys();
    var a = iter.next().value;

    while (a) {
        b.push(a);
        a = iter.next().value;
    }
    if (res)
        res.json({
            devices: b
        });

    return b;

}

function listDevices(req, res) {
    var api = require('../../config').API_CLOUD + "/api/device/get";
    var macs = getConnectedDevides();
    console.log(macs);
    var body = {
        macList: macs
    };
    request.post(api, {
        body: body,
        json: true
    }, function (err, response, body) {
        if (err) {
            res.status(503).json({
                message: String(err)
            });
            return;
        } else {
            res.json(body);
        }
    });
}
module.exports = {
    pushNotice: pushNotice,
    getConnectedDevides: getConnectedDevides,
    listDevices: listDevices

};