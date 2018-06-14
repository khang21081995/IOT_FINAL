const winston = require('winston');
require('winston-daily-rotate-file');
const moment = require('moment');
const tsFormat = () => moment().format('YYYY-MM-DD hh:mm:ss').trim();

const moduleName = require('../package').name;
var transport = new (winston.transports.DailyRotateFile)({
    filename: __dirname+'/../logs/'+moduleName,
    datePattern: 'DD-MM-YYYY',
    timestamp: tsFormat,
    json: false,
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '20d'
});


var logger = new (winston.Logger)({
    transports: [
        transport
    ]
});
// set logging level one of { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
logger.level = 'debug';

// logger.info("khang")
module.exports = logger;
