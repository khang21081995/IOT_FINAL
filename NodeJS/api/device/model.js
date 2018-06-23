'use strict';
var findOrCreate = require('mongoose-findorcreate')
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;
var device = new Schema({
    deviceName: {
        type: String,
        default: ""
    },
    deviceMac: {
        type: String
    },
    temprature: {
        type: String
    },
    humidity: {
        type: String
    },
    createTime: {
        type: Date,
        default: Date.now
    },
    lastModifyTime: {
        type: Date
    }
});

device.plugin(findOrCreate);

device.pre('save', function (next) {
    this.lastModifyTime = Date.now();

    return next();
});


module.exports = mongoose.model('Device', device);