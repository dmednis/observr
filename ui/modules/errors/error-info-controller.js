app.controller('ErrorInfoController', ['$scope', '$rootScope', '$state', '$stateParams', '$rpc', 'SpinnerService', 'toaster', 'ngDialog', ErrorInfoController]);

function ErrorInfoController($scope, $rootScope, $state, $stateParams, $rpc, $spinner, $toaster, ngDialog) {
    "use strict";

    var ei = this;

    ei.authUser = $rootScope.user;
    ei.state = $state.current.name;

    ei.solve = solve;
    
    function init() {
        if ($stateParams.id) {
            loadError($stateParams.id);
        }
    }


    function loadError(id) {
        $spinner.on('.spinner');
        $rpc.errors.get(id)
            .then(function (res) {
                ei.error = res.data;
                $spinner.off('.spinner');
            }, function (err) {
                $toaster.pop('error', 'Something went wrong!');
            })
    }


    function solve() {
        $spinner.on('.spinner');
        $rpc.errors.solve({pid: ei.error.id})
            .then(function (res) {
                $toaster.pop('success', 'Error marked as solved!');
                $spinner.off('.spinner');
                $state.go('app.errors.list');
            }, function (err) {
                $toaster.pop('error', 'Something went wrong!');
            })
    }
    
    init();
}