var fs = require('fs'),
    express = require('express'),
    path = require('path'),
    basename = path.basename(module.filename),
    clc = require('cli-color'),
    _ = require('lodash'),
    winston = require('winston');

function Loader(_app) {
    var app = _app;
    var router = this.router = express.Router();
    var endpoints = [];
    var non_exports = ['app'];

    winston.info(clc.bgGreen(clc.black("REGISTERING CONTROLLERS")));

    fs.readdirSync(__dirname)
        .filter(function (file) {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-13) === 'controller.js');
        })
        .forEach(function (file) {
            var Controller = require('./' + file);
            var controller = new Controller(app);
            var isPublic;
            if (controller.exposed == '*') {
                for (var prop in controller) {
                    if (typeof controller[prop] == 'function') {
                        if (non_exports.indexOf(prop) != -1) {
                            continue;
                        }
                        if (prop[0] == '_') {
                            continue;
                        }
                        isPublic = false;
                        if (controller.public.indexOf(prop) != -1) {
                            isPublic = true;
                        }
                        endpoints.push({
                            controller: controller,
                            ctrlName: controller.name,
                            name: prop,
                            handler: controller[prop],
                            isPublic: isPublic
                        });
                    }
                }
            } else if (typeof controller.exposed === 'object' && controller.exposed.length) {
                for (var m = 0; m < controller.exposed.length; m++) {
                    if (typeof controller[controller.exposed[m]] == 'function') {
                        if (non_exports.indexOf(controller.exposed[m]) != -1) {
                            continue;
                        }
                        if (controller.exposed[m][0] == '_') {
                            continue;
                        }
                        isPublic = false;
                        if (controller.public.indexOf(controller.exposed[m]) != -1) {
                            isPublic = true;
                        }
                        endpoints.push({
                            controller: controller,
                            ctrlName: controller.name,
                            name: controller.exposed[m],
                            handler: controller[controller.exposed[m]],
                            isPublic: isPublic
                        });
                    }
                }
            }
            winston.info(clc.green("  > " + controller.name));
        });
    
    var AuthHandler = require('../middleware/auth.js');
    var ErrorHandler = require('../middleware/error.js');

    var handlers = {
        auth: new AuthHandler(app),
        error: new ErrorHandler(app)
    };

    router.use(handlers.error.handler.bind(handlers.error));

    for (var r = 0; r < endpoints.length; r++) {
        var ep = endpoints[r];
        switch (ep.name) {
            case 'list':
                ep.url = '/' + ep.ctrlName;
                ep.method = 'get';
                break;
            case 'get':
                ep.url = '/' + ep.ctrlName + '/:id';
                ep.method = 'get';
                break;
            case 'update':
                ep.url = '/' + ep.ctrlName + '/:id';
                ep.method = 'put';
                break;
            case 'new':
                ep.url = '/' + ep.ctrlName;
                ep.method = 'post';
                break;
            case 'delete':
                ep.url = '/' + ep.ctrlName + '/:id';
                ep.method = 'delete';
                break;
            default:
                ep.url = '/' + ep.ctrlName + '/' + ep.name;
                ep.method = 'post';
                break;
        }

        if (ep.isPublic) {
            router[ep.method](ep.url, requestHandler.bind(this));
        } else {
            router[ep.method](ep.url, handlers.auth.middleware.bind(handlers.auth), requestHandler.bind(this));
        }
    }

    app.routes = endpoints;


    winston.info(clc.bgGreen(clc.black("DONE")));

    var RPCService = require('../services/rpc.js');
    RPCService = new RPCService(app, router);
    app.services.rpc = RPCService;

    router.all('/*',  requestHandler.bind(this));

    return this;


    function requestHandler(req, res, next) {
        var that = this;
        var resolved;

        var resolvedIdx = _.findIndex(endpoints, {
            url: req.route.path,
            method: req.method.toLowerCase()
        });

        if (resolvedIdx > -1) {
            resolved = endpoints[resolvedIdx];
        }

        if (typeof resolved == 'undefined') {
            res.status(404).json({message: "no endpoint"});
            return;
        }

        var query = {};
        _.forOwn(req.query, function (value, key) {
            if (value.indexOf('{') > -1 || value.indexOf('[') > -1) {
                try {
                    query[key] = JSON.parse(value);
                } catch (e) {
                    console.log("JSON PARSING ERRROR", value, e);
                    query[key] = value;
                }
            } else {
                query[key] = value;
            }
        });

        var params = _.merge(query, req.body, req.params);
        var returned = resolved.handler.call(resolved.controller, params, function (result, code) {
            if (typeof code == 'undefined') {
                code = 200;
            }
            res.status(code).json(result);
        }, req, res);

        if (returned) {
            returned.catch(function (err) {
                next(err);
                console.log(err.stack);
            });
        }
    }
}


module.exports = Loader;