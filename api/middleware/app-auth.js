function AppAuthProvider(_app) {
    this.app = _app;
    this.secret = this.app.config.secret;
    
    return this;
}

AppAuthProvider.prototype.middleware = function (req, res, next) {

};

module.exports = AppAuthProvider;