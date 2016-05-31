var md5 = require('md5');
var _ = require('lodash');
var MongoClient = require('mongodb').MongoClient;


/**
 * 
 * @param app
 * @returns queue
 * @constructor
 */
function Observr (app) {
    this.app = app;
    this.db = this.app.db;
    this.queue = this.app.services.queue;
    //this.socket = this.app.services.socket;


    this.processError = this.processError.bind(this);
    this.processEvent = this.processEvent.bind(this);
    this.processLog = this.processLog.bind(this);

    this.init.call(this);

    return this;
}

Observr.prototype.init = function () {
    var that = this;
    // init error processor
    this.queue.process('error', 5, function (job, done) {
        var hash = md5(job.data.message + job.data.stack);
        return that.db.error.findOrCreate({
            where: {
                hash: hash
            },
            defaults: {
                projectId: job.data.project.id
            }
        }).spread(function (error) {
            return error.createErrorEvent({
                message: job.data.message,
                stack: job.data.stack,
                data: job.data.data
            });
        }).then(function (errEvent) {
            done();
        });
    });

    // init event processor
    this.queue.process('event', 5, function (job, done) {
        that.db.event.create({
            name: job.data.event,
            data: job.data.data,
            projectId: job.data.project.id
        }).then(function (event) {
            done();
        });
    });

    // init error processor
    this.queue.process('log', 20, function (job, done) {
        var url = 'mongodb://localhost:27017/observr';
        MongoClient.connect(url, function(err, db) {
            console.log("Connected correctly to server");

            var collection = db.collection('logs_' + job.data.project.id);
            collection.insertMany([
                {a : 1}, {a : 2}, {a : 3}
            ], function(err, result) {
                console.log("Inserted 3 documents into the document collection");
                db.close();
                done();
            });
        });

    });
};

Observr.prototype.processError = function (project, message, stack, data) {
    var job = this.queue.create('error', {
        message: message,
        stack: stack || "",
        data: data || {},
        project: project
    }).save( function(err){
        
    });
};

Observr.prototype.processEvent = function (project, event, data) {
    var job = this.queue.create('event', {
        event: event,
        data: data || {},
        project: project
    }).save( function(err){
        
    });
};

Observr.prototype.processLog = function (project, time, data) {
    var job = this.queue.create('log', {
        time: time,
        data: data,
        project: project
    }).save( function(err){
        if(!err) {
            console.log( job.id );
        }
    });
};



module.exports = Observr;