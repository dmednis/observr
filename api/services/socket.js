var kue = require('kue');
var io = require('socket.io');

/**
 *
 * @param server
 * @returns queue
 * @constructor
 */
function Socket (server) {
    this.socket = io(server);

    this.socket.on('connection', function (socket) {
        console.log("connected");
        setInterval(function () {
            socket.emit('test', { hello: 'world' });
        }, 3000);

    });

    return this.socket;
}



module.exports = Socket;