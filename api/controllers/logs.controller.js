var _ = require('lodash');
var md5 = require('md5');

function LogsController(_app) {
    this.app = _app;
    this.db = this.app.db;
    this.observr = this.app.services.observr;

    this.name = 'logs';
    this.exposed = '*';
    this.public = [];
    this.middleware = {
        register: ['appAuth']
    };

    return this;
}

LogsController.prototype.list = function (params, done, req) {
    
};

LogsController.prototype.register = function (params, done, req) {
    if (params.type) {
        done({ok: true});
        this.observr.processLog(req.project, params.type, params.time, params.data);
    } else {
        done({ok: false}, 400);
    }
};

LogsController.prototype.get = function (params, done) {

};

module.exports = LogsController;