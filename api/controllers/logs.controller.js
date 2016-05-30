var _ = require('lodash');
var md5 = require('md5');

function LogsController(_app) {
    this.app = _app;
    this.db = this.app.db;
    this.name = 'events';
    this.exposed = '*';
    this.public = [];

    return this;
}

LogsController.prototype.list = function (params, done, req) {
    
};

LogsController.prototype.register = function (params, done) {
   
};

LogsController.prototype.get = function (params, done) {

};

module.exports = LogsController;