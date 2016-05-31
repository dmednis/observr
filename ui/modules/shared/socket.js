app.factory('$socket', ['socketFactory', $socket]);

function $socket(socketFactory) {
    var socket = io.connect('http://localhost:8080', {path: "/api/socket.io"});

    return socketFactory({
        ioSocket: socket
    });
}