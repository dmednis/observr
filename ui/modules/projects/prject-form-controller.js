app.controller('ProjectFormController', ['$scope', '$rootScope', '$state', '$rpc', 'SpinnerService', 'toaster', 'ngDialog', '$stateParams', ProjectFormController]);

function ProjectFormController($scope, $rootScope, $state, $rpc, $spinner, $toaster, ngDialog, $stateParams) {
    "use strict";

    var pf = this;

    pf.authUser = $rootScope.user;
    pf.state = $state.current.name;

    pf.projectForm = {};

    if (pf.state == "app.projects.profile") {
        pf.projectId = pf.authUser.id;
    } else if (pf.state == "app.projects.edit") {
        pf.projectId = $stateParams.id;
    }

    pf.saveProject = saveProject;
    pf.deleteProject = deleteProject;


    function init() {
        if (pf.projectId) {
            loadProject(pf.projectId);
        }
    }
    

    function loadProject(id) {
        $spinner.on('.spinner');
        $rpc.projects.get(id)
            .then(function (res) {
                if (!res.data) {
                    $state.go('app.projects.list');
                    $toaster.pop('error', "Project not found!");
                    return;
                }
                pf.project = res.data;
                $spinner.off('.spinner');
            }, function (err) {

            })
    }

    function saveProject() {
        $spinner.on('.spinner');
        pf.projectForm.$setSubmitted();
        if (pf.projectForm.$invalid) {
            $spinner.off('.spinner');
            return;
        }
        var promise;
        if (pf.project.id) {
            promise = $rpc.projects.update(pf.project.id, pf.project);
        } else {
            promise = $rpc.projects.new(pf.project);
        }
        promise.then(function (res) {
            pf.project = res.data;
            pf.projectId = pf.project.id;
            $toaster.pop('success', "Project saved!");
            $spinner.off('.spinner');
        }, function (err) {
            $toaster.pop('error', "Something went wrong!");
        })
    }
    
    function deleteProject() {
    
    }

    init();
}