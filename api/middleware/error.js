var clc = require('cli-color');

/**
 * 
 * ErrorHandler. Provides global error handler middleware.
 * 
 * @param _app
 * @constructor
 */
function ErrorHandler (_app) {
    this.app = _app;
}

ErrorHandler.prototype.handler = function (err, req, res, next) {
    console.error(clc.red(err.message));
    console.error(clc.red(err.stack));
    console.log(err);
    console.log("asd");
    if (app.debug) {
        res.status(500).json({
            error: err.message,
            stack: err.stack
        });
    } else {
        res.status(500).json({
            message: 'system error'
        })
    }
    
    console.error(clc.red(err.message));
    console.error(clc.red(err.stack));
};

module.exports = ErrorHandler;
