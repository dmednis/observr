app.factory('$socket', ['socketFactory', $socket]);

function $socket(socketFactory) {
    var socket = io.connect('http://139.59.143.216/', {path: "/api/socket.io"});

    return socketFactory({
        ioSocket: socket
    });
}