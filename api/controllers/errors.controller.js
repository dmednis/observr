var _ = require('lodash');
var md5 = require('md5');

function ErrorsController(_app) {
    this.app = _app;
    this.db = this.app.db;
    this.name = 'errors';
    this.exposed = '*';
    this.public = [];

    return this;
}

ErrorsController.prototype.list = function (params, done, req) {
    
};

ErrorsController.prototype.get = function (params, done) {
   
};



module.exports = ErrorsController;