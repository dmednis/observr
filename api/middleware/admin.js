var Promise = require('bluebird');


function AdminProvider(_app) {
    this.app = _app;
    this.secret = this.app.config.secret;
    
    return this;
}

AdminProvider.prototype.middleware = function (req, res, next) {
    if (req.user.role != 'admin') {
        res.status(403).json({message: 'access denied'});
    } else {
        next();
    }
};


module.exports = AdminProvider;