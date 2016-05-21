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

    $rpc.users.list()
        .then(function (res) {
            var users = res.data.rows;
            users.forEach(function (user) {
               user.text = user.firstName + ' ' + user.lastName;
            });
            pf.userList = users;
        }, function () {

        });


    pf.saveProject = saveProject;
    pf.deleteProject = deleteProject;

    pf.addMember = addMember;

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

    function addMember(userId, role) {
        if (!userId || !role) {
            return;
        }
        if (!pf.project.members) {
            pf.project.members = {};
        }
        var user = _.find(pf.userList, function(u) {
            return u.id == userId;
        });
        pf.project.members[user.id] = {
            name: user.firstName + ' ' + user.lastName,
            id: user.id,
            role: role
        };
        pf.member = null;
        pf.memberRole = null;
    }

    init();
}