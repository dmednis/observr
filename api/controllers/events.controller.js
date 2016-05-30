var _ = require('lodash');
var md5 = require('md5');

function EventsController(_app) {
    this.app = _app;
    this.db = this.app.db;
    this.observr = this.app.services.observr;

    this.name = 'events';
    this.exposed = '*';
    this.public = [];
    this.middleware = {
        register: ['appAuth']
    };

    return this;
}

EventsController.prototype.list = function (params, done, req) {
    
};

EventsController.prototype.register = function (params, done, req) {
    if (params.event) {
        done({ok: true});
        this.observr.processError(req.project, params.message, params.stack, params.data);
    } else {
        done({ok: false}, 400);
    }
};

EventsController.prototype.solve = function (params, done) {

};

EventsController.prototype.get = function (params, done) {

};

module.exports = EventsController;