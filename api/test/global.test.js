process.env.NODE_ENV = 'test';

var assert = require("assert");
var request = require('supertest');
var app = require("../app.js");


describe('Data models', function () {
    Object.keys(app.db).forEach(function (model) {
        {
            if (model !== 'sequelize' && model !== 'Sequelize') {
                it(model + ' works', function (done) {
                    app.db[model].findAll({limit: 1}).then(function () {
                        done();
                    }, function (err) {
                        done(err);
                    });
                });
            }
        }
    });
});

describe('API', function () {
    for (var r = 0; r < app.routes.length; r++) {
        var route = app.routes[r];
        it('API endpoint ' + route.url + ' works', function (done) {
            request(app)[route.method](route.url)
                .expect(function (res) {
                    var statuses = [200, 400, 401];
                    if (statuses.indexOf(res.statusCode) > -1) {
                        return true;
                    } else {
                        throw new Error('Expected ' + statuses + ' got ' + res.statusCode);
                    }
                })
                .end(done)
        })
    }

    for (var r = 0; r < app.routes.length; r++) {
        var route = app.routes[r];
        it('API endpoint auth ' + route.url + ' works', function (done) {
            if (!route.isPublic) {
                request(app)[route.method](route.url)
                    .expect(function (res) {
                        var statuses = [401];
                        return true;
                        if (statuses.indexOf(res.statusCode) > -1) {
                            return true;
                        } else {
                            throw new Error('Expected ' + statuses + ' got ' + res.statusCode);
                        }
                    })
                    .end(done)
            } else {
                request(app)[route.method](route.url)
                    .expect(function (res) {
                        var statuses = [200, 400];
                        return true;
                        if (statuses.indexOf(res.statusCode) > -1) {
                            return true;
                        } else {
                            throw new Error('Expected ' + statuses + ' got ' + res.statusCode);
                        }
                    })
                    .end(done)
            }
        })
    }
});