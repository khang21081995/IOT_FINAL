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
    model.find().where('deviceMac').in(macList).exec(function (err, data) {
        if (err) {
            res.status(503).json({
                message: String(err)
            });
        } else {
            var ret = data.map(obj => {
                return {
                    mac: obj.deviceMac,
                    name: obj.deviceName
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