app.factory('$socket', ['socketFactory', $socket]);

function $socket(socketFactory) {
    var socket = io.connect(window.location.origin + '/', {path: "/api/socket.io"});



    return socketFactory({
        ioSocket: socket
    });
}