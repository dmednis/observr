var _ = require('lodash');
var md5 = require('md5');

function EventsController(_app) {
    this.app = _app;
    this.db = this.app.db;
    this.name = 'events';
    this.exposed = '*';
    this.public = [];

    return this;
}

EventsController.prototype.list = function (params, done, req) {
    
};

EventsController.prototype.get = function (params, done) {
   
};



module.exports = EventsController;