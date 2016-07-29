var _ = require('lodash');
var md5 = require('md5');
var MongoClient = require('mongodb').MongoClient;


/**
 *
 * LogsController. Responsible for observed log endpoints.
 *
 * @param _app
 * @returns {LogsController}
 * @constructor
 */
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


/**
 *
 * Returns a list of registered logs.
 *
 * @param params
 * @param done
 * @param req
 */
LogsController.prototype.list = function (params, done, req) {
    if (params.customFilters.pid) {
        var url = 'mongodb://localhost:27017/observr';
        MongoClient.connect(url, function (err, db) {
            var collection = db.collection('logs_' + params.customFilters.pid);
            collection.find({}).sort({time: -1}).limit(Number(params.limit)).skip(Number(params.offset)).toArray(function (err, _logs) {
                collection.find({}).count(function (err2, count) {
                    if (err || err2) {
                        console.error(err, err2);
                    }

                    var logs = [];
                    _logs.forEach(function (log) {
                        logs.push({
                            time: log.time || new Date(),
                            type: log.type || 'log',
                            data: log.data || {}
                        });
                    });
                    done({rows: logs, count: count});
                    db.close();
                });
            });
        });
    } else {
        done({rows: [], count: 0}, 200)
    }
};


/**
 *
 * Registers an incoming log.
 *
 * @param params
 * @param done
 * @param req
 */
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