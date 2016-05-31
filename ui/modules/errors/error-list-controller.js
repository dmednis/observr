app.controller('ErrorListController', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$rpc', 'SpinnerService', 'toaster', 'ngDialog', ErrorListController]);

function ErrorListController($scope, $rootScope, $state, $stateParams, $timeout, $rpc, $spinner, $toaster, ngDialog) {
    "use strict";

    var el = this;

    el.authUser = $rootScope.user;
    el.state = $state.current.name;
    

    function init() {
        if ($stateParams.pid) {
            setProject($stateParams.pid);
        }
    }

    function setProject(pid) {
        $spinner.on('.spinner');
        $rpc.projects.get(pid)
            .then(function (res) {
                var project = res.data;
                if (!project) {
                    $toaster.pop('error', "No access rights!");
                    $state.go('app.errors.list', {pid: null});
                } else {
                    el.project = project;
                    console.log(pid);
                    $timeout(function () {
                        $scope.$broadcast('set_static_filters', {alias: 'eg', customFilters: {pid: pid}})
                    })
                }
            })
    }

    init();
}