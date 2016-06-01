var jwt = require('jsonwebtoken'),
    _ = require('lodash'),
    bcrypt = require('bcrypt');

/**
 * 
 * AuthController. Responsible for user authentification.
 * 
 * @param _app
 * @returns {AuthController}
 * @constructor
 */
function AuthController(_app) {
    this.app = _app;
    this.db = this.app.db;
    this.name = 'auth';
    this.exposed = '*';
    this.public = ['login'];
    this.secret = this.app.config.secret;
    
    return this;
}

AuthController.prototype.login = function (params, done, req) {
    var that = this;
    return this.db.user.findOne({
        where: {
            username: params.username,
            status: true
        },
        attributes: ['id', 'username', 'password', 'email', 'emailHash', 'firstName', 'lastName', 'role']
    }).then(function (user) {
        if (!user) {
            done({message: 'invalid auth'}, 401);
        } else {
            if (bcrypt.compareSync(params.password, user.password)) {
                var _user = user.get();
                delete _user.password;
                var tokeninfo = {
                    id: _user.id
                };
                var token = jwt.sign(tokeninfo, that.secret);
                user.lastLogin = new Date();
                user.lastLoginIP = req.ip;
                done({user: _user, token: token});
                user.save();
            } else {
                done({message: 'invalid auth'}, 401);
            }
        }
    });
};

AuthController.prototype.user = function (params, done, req) {
    if (req.user) {
        done({user: req.user});
    } else {
        done({message: ''}, 401);
    }
};

module.exports = AuthController;