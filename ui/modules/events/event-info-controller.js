app.controller('EventInfoController', ['$scope', '$rootScope', '$state', '$stateParams', '$rpc', 'SpinnerService', 'toaster', 'ngDialog', EventInfoController]);

function EventInfoController($scope, $rootScope, $state, $stateParams, $rpc, $spinner, $toaster, ngDialog) {
    "use strict";

    var evi = this;

    evi.authUser = $rootScope.user;
    evi.state = $state.current.name;
    
    function init() {
        if ($stateParams.id) {
            loadEvent($stateParams.id);
        }
    }


    function loadEvent(id) {
        $spinner.on('.spinner');
        $rpc.events.get(id)
            .then(function (res) {
                evi.event = res.data;
                $spinner.off('.spinner');
            }, function (err) {
                $toaster.pop('error', 'Something went wrong!');
            })
    }
    
    init();
}