var io = require('../bin/www').io;
var connectedClient = new Map();


function socketHandle(socket) {
    socket.on("connected", function (data) {
        var mac = data.MAC;
        console.log("User with mac: " + mac + " connected");
        connectedClient.set(mac, socket);
        socket.emit("welcome", {
            mess: "Welcome " + mac
        });

        socket.on("addData", function (data) {
            
        })

        socket.on('disconnect', function () {
            console.log('user with mac ' + mac + ' disconnected');
            connectedClient.delete(mac);
        });
    });
}



module.exports.io = io;
module.exports.socketHandle = socketHandle;
module.exports.mapConnectedClient = connectedClient;