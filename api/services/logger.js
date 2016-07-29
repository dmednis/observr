/**
 *
 * Logging helper.
 *
 * @param _app
 * @constructor
 */
function Logger(_app) {
    this.app = _app;
    this.logDB = this.app.db.systemLog;

    this.log = this.log.bind(this);
}


Logger.prototype.log = function (event, data) {
    if (!event && !data) {
        console.log("!!!EMPTY LOG PARAMETERS");
        return null;
    }
    return this.logDB.create({event: event || "log", data: JSON.stringify(data) || ""})
        .then(function () {
            console.log("LOGGED");
        }, function (err) {
            console.log("!!!LOG ERROR", err);
        })
};

module.exports = Logger;