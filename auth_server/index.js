// import for global winston logging
const loggingUtil = require('./utils/logging.utils.js')
global.logging = loggingUtil.defaultLogger()

const config = require("./config");
global.config = config

// db connection
require('./db/connection');
// load db models
require('./db/index')

// firebase app setup
require("./config/firebase");

const server = require('./express');

const expressServer = server()
global.expressServer = expressServer