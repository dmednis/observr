var jwt = require('jsonwebtoken');
var _ = require('lodash');
var bcrypt = require('bcrypt');
var ActiveDirectory = require('activedirectory');

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
    this.public = ['login', 'ldap'];
    this.secret = this.app.config.secret;
    this.config = this.app.config;
    
    return this;
}

AuthController.prototype.login = function (params, done, req) {
    if (this.config.ldap) {
        this._ldapLogin(params, done, req);
    } else {
        this._dbLogin(params, done, req);
    }
};


AuthController.prototype._dbLogin = function (params, done, req) {
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

AuthController.prototype._ldapLogin = function (params, done, req) {
    var that = this;
    var ldapConfig = this.config.ldap;
    var ad = new ActiveDirectory(ldapConfig);
    return this.db.user.findOne({
        where: {
            username: params.username,
            status: true
        },
        attributes: ['id', 'username', 'password', 'email', 'emailHash', 'firstName', 'lastName', 'role', 'ldap']
    }).then(function (user) {
        if (!user || user.ldap) {
            ad.authenticate(params.username + '@' + ldapConfig.domain, params.password, function(err, auth) {
                if (err) {
                    done({message: 'server error', error: err}, 500);
                    return;
                }
                if (auth) {
                    ad.findUser(params.username, function(err, adUser) {
                        if (err) {
                            done({message: 'server error', error: err}, 500);
                            return;
                        }
                        if (!adUser) {
                            done({message: 'server error', error: ''}, 500);
                        } else {
                            var promise;
                            var userData = {
                                firstName: adUser.givenName,
                                lastName: adUser.sn,
                                email: adUser.mail.toLowerCase(),
                                username: adUser.sAMAccountName,
                                password: bcrypt.hashSync(params.password, 10),
                                ldapInfo: adUser.dn,
                                ldap: true
                            };
                            if (user) {
                                user.set(userData);
                                promise = user.save();
                            } else {
                                promise = that.db.user.create(userData);
                            }
                            promise.then(function (user) {
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
                            });
                        }
                    });
                } else {
                    done({message: 'invalid auth'}, 401);
                }
            });
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