var io = require('../server/www').io;
var connectedClient = new Map();

function socketHandle(socket) {
    console.log("New user!!!");

    socket.on("device_connected", function (data) {
        var mac = data;
        console.log("User with mac: " + mac + " connected");
        connectedClient.set(mac, socket);

        socket.on("addData", function (data) {
            // console.log(data);
            io.emit(mac + "_add_data", data);
        });
        
        // io.emit("new_device_connected", mac);
        socket.on('disconnect', function () {
            console.log('user with mac ' + mac + ' disconnected');
            connectedClient.delete(mac);
            io.emit("device_disconnected", mac);
        });
    });
}



module.exports.io = io;
module.exports.socketHandle = socketHandle;
module.exports.mapConnectedClient = connectedClient;