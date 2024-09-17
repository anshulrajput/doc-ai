const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');

const app = express();
global.expressApp = app

const routes = require('./routes/index');

// For combining winston logs with morgan
const myStream = {
    write: (text) => {
        if(text.split('/')[1] != undefined && text.split('/')[1] == 'api')
            logging.api(text.replace(/\n$/, '')) 
    }
}
// Logger for HTTP Requests
app.use(logger('tiny', { stream: myStream }))

// app.use(express.json()) // for json
// app.use(express.urlencoded({ extended: true, limit:'50mb' })) // for form data
app.use(bodyParser.json({limit:'50mb'}));  // for json
app.use(bodyParser.urlencoded({extended:true, limit:'50mb'}));  // for form data

// Enable Cross-origin resource sharing
// app.use(cors());
app.use(cors({
    credentials: true,
    origin: config.cors_origins
}));

app.use(function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "https://ai-defect-review.uc.r.appspot.com");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, access-token");
    next();
});

// Enable gzip compression
app.use(compression());

// static path for frontend files
// app.use(express.static(path.join(__dirname,"../build")));
app.use(express.static(path.join(__dirname, 'build')));


// Enable helmet middleware
// app.use(helmet());
app.use(helmet({
    contentSecurityPolicy: false,
  }));

// Disable x-powered-by header
app.disable('x-powered-by');

// Enable routes
app.use(routes());

app.enable('trust proxy');

// for https redirection
// app.use((req, res, next) => {
//     if (req.secure) {
//         next();
//     } else {
//         res.redirect(`https://${req.headers.host}${req.url}`);
//     }
// });

module.exports = () => {
    let server = app.listen(config.http_port, () => {
        logging.info(`Server listening on: ${config.http_port}`); // eslint-disable-line no-console
    });
    return server
};
