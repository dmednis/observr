app.controller('ProjectListController', ['$scope', '$rootScope', '$state', '$rpc', 'SpinnerService', 'toaster', 'ngDialog', ProjectListController]);

function ProjectListController($scope, $rootScope, $state, $rpc, $spinner, $toaster, ngDialog) {
    "use strict";

    var pl = this;

    pl.authUser = $rootScope.user;
    pl.state = $state.current.name;


    function init() {
        loadProjects();
    }

    function loadProjects() {
        $spinner.on('.spinner');
        $rpc.projects.list()
            .then(function (res) {
                pl.projects = res.data.rows;
                pl.total = res.data.count;
                $spinner.off('.spinner');
            }, function (err) {

            })
    }



    init();
}