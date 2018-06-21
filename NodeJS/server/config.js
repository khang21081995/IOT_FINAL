var cf = require("../config");

function getRootUrl() {
    var url = cf.BASE_URL;
    var port = this.getPort();
    var httpType = cf.TYPE;
    return httpType + "://" + url + ":" + port;
}

function getPort() {
    return cf.PORT;
}
module.exports = {
    getPort: getPort,
    getRootUrl: getRootUrl
}
