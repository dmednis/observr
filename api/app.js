var express      = require('express');
var http         = require('http');
var bodyParser   = require("body-parser");
var cookieParser = require("cookie-parser");
var clc          = require('cli-color');
var winston      = require('winston');
var morgan       = require('morgan');

winston.info(clc.bgGreen(clc.black("STARTING APP")));

var app = express();
var server = http.Server(app);

// Read application configuration
app.config = require('./config/config.js');
app.environment = process.env.NODE_ENV || app.config.env || 'production';
app.debug = app.config.debug || app.environment == 'development';
var port = process.env.PORT || app.config.port || 4100;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// Bootstrap DB models
app.db = require('./models/index.js');

// Bootstrap application services
app.services = {};

var Queue = require('./services/queue.js');
app.services.queue = new Queue(app.config);
var Mailer = require('./services/mailer.js');
app.services.mailer = new Mailer(app);
var Socket = require('./services/socket.js');
app.services.socket = new Socket(server);
var Observr = require('./services/observr.js');
app.services.observr = new Observr(app);

// Bootstrap controllers
var RoutesLoader = require('./controllers/index.js');
var loader = RoutesLoader(app);
app.use(loader.router);

// Expose application port
server.listen(port, function () {
    winston.info(clc.bgGreen(clc.black("SERVER LISTENING ON " + port)));
});


module.exports = app;