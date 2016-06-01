var _ = require('lodash');
var md5 = require('md5');

/**
 * 
 * SystemController. Responsible for system REST API endpoints.
 * 
 * @param _app
 * @returns {SystemController}
 * @constructor
 */
function SystemController(_app) {
    this.app = _app;
    this.db = this.app.db;
    this.observr = this.app.services.observr;

    this.name = 'system';
    this.exposed = '*';
    this.public = [];
    this.middleware = {
        emails: ['auth', 'admin'],
        logs: ['auth', 'admin']
    };

    return this;
}


/**
 * 
 * Returns a list of system sent emails.
 * 
 * @param params
 * @param done
 * @param req
 * @returns {*}
 */
SystemController.prototype.emails = function (params, done, req) {
    var that = this;
    var query = this.db.email.makeGenericQuery(params);


    return that.db.email.findAndCountAll(query)
        .then(function (events) {
            done(events);
        });

};


/**
 * 
 * Returns a list of system logs.
 * 
 * @param params
 * @param done
 * @param req
 * @returns {*}
 */
SystemController.prototype.logs = function (params, done, req) {
    var that = this;
    var query = this.db.systemLog.makeGenericQuery(params);


    return that.db.systemLog.findAndCountAll(query)
        .then(function (events) {
            done(events);
        });

};

module.exports = SystemController;