var jwt = require('jsonwebtoken');
var Promise = require('bluebird');
var cacheManager = require('cache-manager');
var cache = cacheManager.caching({store: 'memory', max: 100, ttl: 120});
var jwtVerifyAsync = Promise.promisify(jwt.verify, jwt);


/**
 * 
 * AuthProvider. Provides middleware for user and application authentification.
 * 
 * @param _app
 * @returns {AuthProvider}
 * @constructor
 */
function AuthProvider(_app) {
    this.app = _app;
    this.secret = this.app.config.secret;
    
    return this;
}

AuthProvider.prototype.middleware = function (req, res, next) {
    var token;
    var that = this;
    if (req.headers['authorization']) {
        token = req.headers['authorization'].split(' ')[1];
    }
    if (!token) {
        res.status(400).json({message: 'no token'});
    } else {
        return jwtVerifyAsync(token, that.secret)
            .then(function (decoded) {
                if (!decoded || !decoded.id) {
                    throw {reason: 'decode error', code: 401};
                }
                var key = 'user_' + decoded.id;
                return cache.wrap(key, function () {
                    return that.app.db.user.findOne({
                        where: {id: decoded.id},
                        attributes: {exclude: ['password']}
                    });
                });
            }).then(function (user) {
                if (!user || !user.id) {
                    throw {reason: 'decode error', code: 401};
                } else {
                    req.user = user;
                    next();
                }
            }).catch(function (err) {
                if (!(err instanceof Error)) {
                    res.status(err.code).json({message: err.reason});
                } else {
                    res.status(500).json(err);
                }
            });
    }
};

AuthProvider.prototype.appMiddleware = function (req, res, next) {
    var apiId;
    var apiKey;
    var that = this;
    
    if (req.body.apiKey) {
        apiKey = req.body.apiKey;
    }

    if (req.body.identifier) {
        apiId = req.body.identifier;
    } else {
        res.status(400).json({message: 'no identifier'});
        return;
    }

    if (!apiKey) {
        res.status(401).json({message: 'no token'});
    } else {
        var key = 'app_' + apiId;
        return cache.wrap(key, function () {
            return that.app.db.project.findOne({
                where: {
                    identifier: apiId
                }
            })
        }).then(function (project) {
            if (project.apiKey == apiKey) {
                req.project = project.get();
                next();
            } else {
                res.status(401).json({message: 'invalid api key'});
            }
        }, function (err) {
            console.log("e", err);
        }).catch(function (err) {
            res.status(500).json(err);
        });
    }
};

module.exports = AuthProvider;