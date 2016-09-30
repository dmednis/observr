var fs = require('fs'),
    express = require('express'),
    path = require('path'),
    basename = path.basename(module.filename),
    clc = require('cli-color'),
    _ = require('lodash'),
    winston = require('winston');


/**
 *
 * Bootstraps controlllers, middleware and services.
 *
 * @param _app
 * @returns {Loader}
 * @constructor
 */
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
            var mw;
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
                        mw = [];
                        if (controller.middleware && controller.middleware[prop]) {
                            mw = controller.middleware[prop];
                        }
                        endpoints.push({
                            controller: controller,
                            ctrlName: controller.name,
                            name: prop,
                            handler: controller[prop],
                            isPublic: isPublic,
                            middleware: mw
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
                        mw = [];
                        if (controller.middleware && controller.middleware[controller.exposed[m]]) {
                            mw = controller.middleware[controller.exposed[m]];
                        }
                        endpoints.push({
                            controller: controller,
                            ctrlName: controller.name,
                            name: controller.exposed[m],
                            handler: controller[controller.exposed[m]],
                            isPublic: isPublic,
                            middleware: mw
                        });
                    }
                }
            }
            winston.info(clc.green("  > " + controller.name));
        });

    var AuthHandler = require('../middleware/auth.js');
    AuthHandler = new AuthHandler(app);
    var ErrorHandler = require('../middleware/error.js');
    ErrorHandler = new ErrorHandler(app);
    var AdminHandler = require('../middleware/admin.js');
    AdminHandler = new AdminHandler(app);

    var middleware = {
        auth: AuthHandler.middleware.bind(AuthHandler),
        appAuth: AuthHandler.appMiddleware.bind(AuthHandler),
        admin: AdminHandler.middleware.bind(AdminHandler)
    };

    router.use(ErrorHandler.handler.bind(ErrorHandler));

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

        if (ep.middleware.length) {
            var args = [ep.url];
            ep.middleware.forEach(function (mw) {
                if (middleware[mw]) {
                    args.push(middleware[mw]);
                } else {
                    console.error('undefined middleware', mw);
                }
            });
            args.push(requestHandler.bind(this));
            router[ep.method].apply(router, args);
        } else if (ep.isPublic) {
            router[ep.method](ep.url, requestHandler.bind(this));
        } else {
            router[ep.method](ep.url, middleware.auth, requestHandler.bind(this));
        }


    }

    app.routes = endpoints;


    winston.info(clc.bgGreen(clc.black("DONE")));

    var RPCService = require('../services/rpc.js');
    RPCService = new RPCService(app, router);
    app.services.rpc = RPCService;

    router.all('/*', requestHandler.bind(this));

    return this;

    /**
     *
     * Request wrapper for all endpoints.
     *
     * @param req
     * @param res
     * @param next
     */
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
            
            res.set({
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT'
            });
            
            res.status(code).json(result);
        }, req, res);

        if (returned) {
            returned.catch(function (err) {
                res.status(500).json({message: 'system error'});
                console.log(err.stack);
            });
        }
    }
}


module.exports = Loader;