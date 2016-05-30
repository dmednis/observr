var kue = require('kue');
var _ = require('lodash');

/**
 * 
 * @param config
 * @returns queue
 * @constructor
 */
function Queue (config) {
    this.config = config;

    var queue;

    try {
        queue = kue.createQueue({
            prefix: 'q' + __dirname,
            redis: {
                port: config.redis_port || 6379,
                host: config.redis_host || '127.0.0.1',
                auth: config.redis_pass || '',
                db: 1, // if provided select a non-default redis db
                options: {
                    // see https://github.com/mranney/node_redis#rediscreateclient
                }
            }
        });
    } catch (e) {
        console.error('Cannot connect to redis.');
    }

    return queue;
}



module.exports = Queue;