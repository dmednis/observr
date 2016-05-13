var jwt = require('jsonwebtoken'),
    Promise = require('bluebird');

var jwtVerifyAsync = Promise.promisify(jwt.verify, jwt);

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
                return that.app.db.user.findOne({where: {id:decoded.id}, attributes: {exclude:['password']}})
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

module.exports = AuthProvider;