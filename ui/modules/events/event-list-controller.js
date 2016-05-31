app.controller('EventListController', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$rpc', 'SpinnerService', 'toaster', 'ngDialog', EventListController]);

function EventListController($scope, $rootScope, $state, $stateParams, $timeout, $rpc, $spinner, $toaster, ngDialog) {
    "use strict";

    var evl = this;

    evl.authUser = $rootScope.user;
    evl.state = $state.current.name;
    

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
                    $state.go('app.events.list', {pid: null});
                } else {
                    evl.project = project;
                    console.log(pid);
                    $timeout(function () {
                        $scope.$broadcast('set_static_filters', {alias: 'evg', customFilters: {pid: pid}})
                    })
                }
            })
    }

    init();
}