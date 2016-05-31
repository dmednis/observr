app.controller('LogStreamerController', ['$socket', '$scope', '$rootScope', '$state', '$stateParams', '$rpc', 'SpinnerService', 'toaster', 'ngDialog', LogStreamerController]);

function LogStreamerController($socket, $scope, $rootScope, $state, $stateParams, $rpc, $spinner, $toaster, ngDialog) {
    "use strict";

    var ls = this;

    ls.authUser = $rootScope.user;
    ls.state = $state.current.name;
    
    function init() {
        if ($stateParams.id) {

        }
    }


    $socket.on('test', function () {
        console.log("ya");
    });
    
    init();
}