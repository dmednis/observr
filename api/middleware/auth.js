var jwt = require('jsonwebtoken'),
    Promise = require('bluebird');

var jwtVerifyAsync = Promise.promisify(jwt.verify, jwt);

const JWT_SECRET = "v23f56y5htrdjytrh5e6h5e6j2tgrg43ggftrh54";

function AuthProvider(_app) {
    this.app = _app;
    
    
    return this;
}

AuthProvider.prototype.middleware = function (req, res, next) {
    var token;
    var that = this;

    if (req.headers['authorization']) {
        token = req.headers['authorization'].split(' ')[1];
    } else {
        if (that.app.debug) {
            res.status(401).json({message: 'unauthorized', error: 'no token'});
        } else {
            res.status(401).json({message: 'unauthorized'});
        }
        return;
    }
    return jwtVerifyAsync(token, JWT_SECRET)
        .then(function (decoded) {
            if (!decoded || !decoded.id) {
                if (that.app.debug) {
                    res.status(401).json({message: 'unauthorized', error: 'jwt error'});
                } else {
                    res.status(401).json({message: 'unauthorized'});
                }
               
                return;
            }
            return that.app.db.user.findById(decoded.id)
        }).then(function (user) {
            if (!user || !user.id) {
                if (that.app.debug) {
                    res.status(401).json({message: 'unauthorized', error: 'user not found'});
                } else {
                    res.status(401).json({message: 'unauthorized'});
                }
                return;
            }
            req.user = user;
            next();
        }).catch(function (err) {
            if (that.app.debug) {
                res.status(401).json({message: 'unauthorized', error: err});
            } else {
                res.status(401).json({message: 'unauthorized'});
            }
        });
};

module.exports = AuthProvider;