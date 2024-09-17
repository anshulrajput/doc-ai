// Main file for Winston Logging
const winston = require('winston');
const util = require('util');

// for formatting json objects in log
const combineMessageAndSplat = () => {
    return {    
        transform: (info) => {
            //combine message and args if any
            info.message =  util.format(info.message, ...info[Symbol.for('splat')]  ||  [] )
            return info;
        }
    }
}

const logger = winston.createLogger({
    levels: { 
        'alert': 1, 
        'error': 3, 
        'warning': 4, 
        'api': 5, 
        'info': 6, 
        'formatting': 7,
        'debug': 8,
        'db': 9
    }
})

winston.addColors({
    'api': 'cyan',
    'formatting': 'blue',
    'db': 'yellow'
})

const console_logging_format = winston.format.combine(
    winston.format.splat(),
    winston.format.colorize(),
    combineMessageAndSplat(),
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
)
const file_logging_format = winston.format.combine(
    winston.format.splat(),
    winston.format.colorize(),
    combineMessageAndSplat(),
    winston.format.timestamp(),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
)

// Adding console logger
logger.add(new winston.transports.Console({
    format: console_logging_format,
    level: 'debug' 
}));

const defaultLogger = (fileLogging=null) => {
    // Adding file logger if required
    if(fileLogging != undefined && fileLogging != null){
        logger.add(new winston.transports.File(
            {
                filename: fileLogging+".log",
                format: file_logging_format,
                level: 'debug',
                dirname: 'logs'
            }
        ));
    }
    return logger
}

module.exports = {
    defaultLogger: defaultLogger,
}