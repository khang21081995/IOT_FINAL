var model = require('./model');

function addCode(req, res) {
    var mac = req.body.mac;
    var code = req.body.code;
    var description = req.body.description;

    if (!mac || !code || !description) {
        res.status(400).json({
            message: "Missing request element"
        });
        return;
    }

    model.findOne({
        deviceMac: mac,
        code: code
    }).exec(function (err, data) {
        if (err) {
            res.status(503).json({
                message: String(err)
            });
        } else if (data) {
            res.status(404).json({
                message: "Dupplicate code!!"
            });
        } else {
            var codes = new model({
                deviceMac: mac,
                code: code,
                description: description
            });
            codes.validate(function (err) {
                if (err) {
                    res.status(400).json({
                        message: String(err)
                    });
                } else {
                    model.create(codes, function (err, data) {
                        if (err) {
                            res.status(503).json({
                                message: String(err)
                            });
                        } else {
                            res.json(data);
                        }
                    });
                }
            });
        }
    });
}

function getCode(req, res) {
    var mac = req.query.mac || "";
    if (mac)
        model.find({
            deviceMac: mac
        }).exec(function (err, data) {
            res.json(data);
        });
    else {
        model.find({}).exec(function (err, data) {
            res.json(data);
        });
    }
}

function updateCode(req, res) {
    var id = req.body._id;
    var code = req.body.code;
    var description = req.body.description;
    if (!id || !code || !description) {
        res.status(400).json({
            message: "Missing input!!!"
        });
        return;
    }
    model.findOne({
        _id: id
    }).exec(function (err, data) {
        if (err || !data) {
            res.status(503).json({
                message: String(err) || "Không tìm thấy bản ghi!!!"
            });
        } else {
            data.code = code;
            data.description = description;
            data.validate(function (err) {
                if (err) {
                    res.status(400).json({
                        message: String(err)
                    });
                } else {
                    data.save();
                    res.json({
                        message: "Update success!!!"
                    });
                }
            });
        }
    });
}


module.exports = {
    addCode: addCode,
    getCode: getCode,
    update: updateCode
}