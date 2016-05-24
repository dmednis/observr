var _ = require('lodash');
var md5 = require('md5');

function IncomingController(_app) {
    this.app = _app;
    this.db = this.app.db;
    this.name = 'incoming';
    this.exposed = '*';
    this.public = [];

    return this;
}

IncomingController.prototype.error = function (params, done) {

    
    
};

IncomingController.prototype.event = function (params, done) {

    
    
};

IncomingController.prototype.log = function (params, done) {

    
    
};


module.exports = IncomingController;