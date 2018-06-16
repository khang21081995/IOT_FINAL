
function pushNotice(req, res) {
    var io = require('../../socketIO/socketServer').io;
    var keyEvent = (req.body.key_event + "").trim();
    var pushData = req.body.push_data;

    if (keyEvent !== 'undefined' && pushData) {
        io.emit(keyEvent, pushData);
        res.status(200).json({
            status: true,
            message: "push data success to devices listening at event " + keyEvent
        });
    } else {
        res.status(400).json({
            status: false,
            message: "Invalid input"
        });
    }
}


module.exports = {
    pushNotice: pushNotice
}