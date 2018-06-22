'use strict';

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;
var code = new Schema({
    deviceMac: {
        type: String
    },
    code: {
        type: String,
        validate: {
            validator: function (v) {
                var s = v.split(",");
                return parseInt(s[0]) == (s.length - 1);
            },
            message: "Invalid code form!!!"
        }
    },
    description: {
        type: String
    }
});

// user.plugin(findOrCreate);

code.pre('save', function (next) {
    return next();
});


module.exports = mongoose.model('Code', code);