var express      = require('express'),
    http         = require('http'),
    bodyParser   = require("body-parser"),
    cookieParser = require("cookie-parser"),
    clc          = require('cli-color'),
    winston      = require('winston'),
    morgan       = require('morgan');

winston.info(clc.bgGreen(clc.black("STARTING APP")));

var app = express();
var server = http.Server(app);

app.config = require('./config/config.js');
app.environment = process.env.NODE_ENV || app.config.env || 'production';
app.debug = app.config.debug || app.environment == 'development';
var port = process.env.PORT || app.config.port || 4100;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.db = require('./models/index.js');

app.services = {};

var Queue = require('./services/queue.js');
app.services.queue = new Queue();
var Mailer = require('./services/mailer.js');
app.services.mailer = new Mailer(app);

var RoutesLoader = require('./controllers/index.js');
var loader = RoutesLoader(app);
app.use(loader.router);


server.listen(port, function () {
    winston.info(clc.bgGreen(clc.black("SERVER LISTENING ON " + port)));
});


module.exports = app;