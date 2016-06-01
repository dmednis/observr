app.factory('$socket', ['socketFactory', $socket]);

function $socket(socketFactory) {
    var socket = io.connect('/', {path: "/api/socket.io"});

    return socketFactory({
        ioSocket: socket
    });
}