app.controller('ProjectLogsController', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$rpc', 'SpinnerService', 'toaster', 'ngDialog', ProjectLogsController]);

function ProjectLogsController($scope, $rootScope, $state, $stateParams, $timeout, $rpc, $spinner, $toaster, ngDialog) {
    "use strict";

    var ll = this;

    ll.authUser = $rootScope.user;
    ll.state = $state.current.name;
    

    function init() {
        if ($stateParams.id) {
            setProject($stateParams.id);
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
                    ll.project = project;
                    $timeout(function () {
                        $scope.$broadcast('set_static_filters', {alias: 'lg', customFilters: {pid: pid}})
                    })
                }
            })
    }

    init();
}