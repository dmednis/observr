var _ = require('lodash');
var md5 = require('md5');

function ErrorsController(_app) {
    this.app = _app;
    this.db = this.app.db;
    this.observr = this.app.services.observr;
    
    this.name = 'errors';
    this.exposed = '*';
    this.public = [];
    this.middleware = {
        register: ['appAuth']
    };
    
    
    
    return this;
}

ErrorsController.prototype.list = function (params, done, req) {
    
};

ErrorsController.prototype.register = function (params, done, req) {
    if (params.message) {
        done({ok: true});
        this.observr.processError(req.project, params.message, params.stack, params.data);
    } else {
        done({ok: false}, 400);
    }
};

ErrorsController.prototype.get = function (params, done) {

};

module.exports = ErrorsController;