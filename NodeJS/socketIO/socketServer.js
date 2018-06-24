var io = require('../server/www').io;
var connectedClient = new Map();
var deviceModel = require('../api/device/model');
var log = require('../utils/logger');

// setInterval(function () {
//     require('../api/socket/controler').refreshDevice();
// }, 60 * 1000);

function socketHandle(socket) {
    console.log("New user!!!");
    var refreshIntervalId = setInterval(function () {
        socket.emit("temp", "Get Temp and Humidity!");
    }, 60 * 1000);
    socket.on("device_connected", function (data) {
        var mac = data;
        if (connectedClient.get(mac)) {
            console.log("DUPP");
            connectedClient.delete(mac);
            socket.dupp = true;
        }
        connectedClient.set(mac, socket);

        var model;
        deviceModel.findOrCreate({
            deviceMac: mac
        }).then((result) => {
            model = result.doc;
            socket.emit("temp", "Get Temp and Humidity!");
        }).catch((err) => {
            log.error(err);
        });

        console.log("User with mac: " + mac + " connected");


        socket.on("addData", function (data) {
            console.log(data);
            io.emit(mac + "_add_data", data);
        });
        socket.on("re-humidity", function (data) {
            console.log(data);
            if (model) {
                model.humidity = data + "%";
                model.save();
            }
            io.emit(mac + "_re-humidity", data + "%");
        });
        socket.on("re-temperature", function (data) {
            console.log(data);
            if (model) {
                model.temprature = data + " *C";
                model.save();
            }
            io.emit(mac + "_re-temperature", data + " *C");
        });
        socket.on("re-temp", function (data) {
            console.log(data);
            if (model) {
                var tmp = data.split("|");
                model.temprature = tmp[0];
                model.humidity = tmp[1];
                model.save();
            }
            io.emit(mac + "_re-temp", data);
        });

        // io.emit("new_device_connected", mac);
        socket.on('disconnect', function () {
            clearInterval(refreshIntervalId);
            console.log('user with mac ' + mac + ' disconnected event fire');
            if (!connectedClient.get(mac).dupp) {
                connectedClient.delete(mac);
                io.emit("device_disconnected", mac);
                console.log('user with mac ' + mac + ' disconnected');

            }
        });
    });
}



module.exports.io = io;
module.exports.socketHandle = socketHandle;
module.exports.mapConnectedClient = connectedClient;