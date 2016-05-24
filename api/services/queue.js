var kue = require('kue'),
    _ = require('lodash');

/**
 *
 * @param app
 * @constructor
 */
function Queue (app) {
    this.app = app;


}



module.exports = Queue;