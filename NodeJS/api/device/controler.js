var model = require('./model');


function addOrUpdateDeviceName(req, res) {
    var mac = req.body.mac;
    var name = req.body.name || "";
    model.findOrCreate({
        deviceMac: mac
    }).then((result) => {
        result.doc.deviceName = name;
        result.doc.save();
        console.log(result);
        res.json({
            message: "Okay"
        });
    }).catch((err) => {
        res.status(503).json({
            message: String(err)
        });
    });

}

function get(req, res) {
    var macList = req.body.macList || [];
    // res.json([{
    //     mac: "7e:e9:17:2d:e6:b4",
    //     name: "Phòng ngủ",
    //     temprature: 20.7,
    //     humidity: 71.2
    // }]);
    // return;
    model.find().where('deviceMac').in(macList).exec(function (err, data) {
        if (err) {
            res.status(503).json({
                message: String(err)
            });
        } else {
            var ret = data.map(obj => {
                return {
                    mac: obj.deviceMac,
                    name: obj.deviceName,
                    temprature: obj.temprature,
                    humidity: obj.humidity
                };
            });
            res.json(ret);
        }
    });
}

module.exports = {
    addDevice: addOrUpdateDeviceName,
    updateDevice: addOrUpdateDeviceName,
    get: get
}