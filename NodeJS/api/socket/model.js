// 'use strict';
//
// var mongoose = require('mongoose');
// mongoose.Promise = require('bluebird');
// var Schema = mongoose.Schema;
// var schedule = new Schema({
//     needCallApi: {
//         type: String,
//         require: true,
//         lowercase: true,
//         trim: true
//     },
//     methodCall: {
//         type: String,
//         default: "",
//         enum: {
//             values: require("./config").acceptedMethod,
//             message: "Method is not Accepted"
//         },
//         uppercase: true,
//         require: true,
//         trim: true
//     },
//     dataSend: {
//         type: Schema.Types.Mixed,
//         default: {},
//         require: false
//     },
//     sendRules: {//true is the same as:  user is existed but have been block by admin and can' login to the system
//         type: String,
//         default: false,
//         require: true,
//         validate: {
//             validator: function (v) {
//                 let regex = "^\\s*($|#|\\w+\\s*=|(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|/|\\,)(?:[0-5]?\\d))?)*)\\s+(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|/|\\,)(?:[0-5]?\\d))?)*)\\s+(\\?|\\*|(?:[01]?\\d|2[0-3])(?:(?:-|/|\\,)(?:[01]?\\d|2[0-3]))?(?:,(?:[01]?\\d|2[0-3])(?:(?:-|/|\\,)(?:[01]?\\d|2[0-3]))?)*)\\s+(\\?|\\*|(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?(?:,(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?)*)\\s+(\\?|\\*|(?:[1-9]|1[012])(?:(?:-|/|\\,)(?:[1-9]|1[012]))?(?:L|W)?(?:,(?:[1-9]|1[012])(?:(?:-|/|\\,)(?:[1-9]|1[012]))?(?:L|W)?)*|\\?|\\*|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?(?:,(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?)*)\\s+(\\?|\\*|(?:[0-6])(?:(?:-|/|\\,|#)(?:[0-6]))?(?:L)?(?:,(?:[0-6])(?:(?:-|/|\\,|#)(?:[0-6]))?(?:L)?)*|\\?|\\*|(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?(?:,(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?)*)(|\\s)+(\\?|\\*|(?:|\\d{4})(?:(?:-|/|\\,)(?:|\\d{4}))?(?:,(?:|\\d{4})(?:(?:-|/|\\,)(?:|\\d{4}))?)*))$";
//                 return new RegExp(regex).test(v);
//             },
//             message: '{VALUE} is not a valid send rule!'
//         }
//
//     },
//     isDelete: {
//         type: Boolean,
//         default: false,
//         require: true
//     },
//     description: {
//         type: String,
//         default: "",
//     },
//     createTime: {type: Date, default: Date.now},
// });
//
// // user.plugin(findOrCreate);
//
// schedule.pre('save', function (next) {
//     return next();
// });
//
//
// module.exports = mongoose.model('Schedule', schedule);
