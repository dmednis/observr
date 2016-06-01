app.controller('LogStreamerController', ['$socket', '$scope', '$rootScope', '$state', '$stateParams', '$rpc', 'SpinnerService', 'toaster', 'ngDialog', LogStreamerController]);

function LogStreamerController($socket, $scope, $rootScope, $state, $stateParams, $rpc, $spinner, $toaster, ngDialog) {
    "use strict";

    var ls = this;

    ls.authUser = $rootScope.user;
    ls.state = $state.current.name;
    ls.logs = [];

    function init() {
        if ($stateParams.id) {
            ls.pid = $stateParams.id;
        }
    }


    $socket.on('log', function (e) {
        if (e.pid = ls.pid) {
            console.log(e);
            if (ls.logs.length > 15) {
                ls.logs.shift();
            }
            ls.logs.push(e.log);
        }
    });
    
    init();
}