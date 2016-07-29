var kue = require('kue');
var io = require('socket.io');

/**
 *
 * Websocket(socket-io) wrapper.
 *
 * @param server
 * @returns queue
 * @constructor
 */
function Socket(server) {
    this.socket = io(server);

    this.socket.on('connection', function (socket) {
        console.log("connected");


    });

    return this.socket;
}


module.exports = Socket;