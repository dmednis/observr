app.controller('UserFormController', ['$scope', '$rootScope', '$state', '$stateParams', '$rpc', 'SpinnerService', 'toaster', 'ngDialog', UserFormController]);

function UserFormController($scope, $rootScope, $state, $stateParams, $rpc, $spinner, $toaster, ngDialog) {
    "use strict";

    var uf = this;

    uf.authUser = $rootScope.user;
    uf.state = $state.current.name;
    uf.userForm = {};

    if (uf.state == "app.users.profile") {
        uf.userId = authUser.id;
    } else if (uf.state == "app.users.edit") {
        uf.userId = $stateParams.id;
    }

    uf.saveUser = saveUser;
    uf.deleteUser = deleteUser;


    function init() {
        if (uf.userId) {
            loadUser(uf.userId);
        }
    }

    function loadUser(id) {
        $spinner.on('.spinner');
        $rpc.users.get(id)
            .then(function (res) {
                uf.user = res.data;
                $spinner.off('.spinner');
            }, function (err) {

            })
    }

    function saveUser() {
        $spinner.on('.spinner');
        uf.userForm.$setSubmitted();
        if (uf.userForm.$invalid
            || (uf.state == 'app.users.new' && (uf.password != uf.password2 || !uf.password))
            || (uf.password != uf.password2 && (uf.password || uf.password2))) {
            $spinner.off('.spinner');
            return;
        }
        if ((uf.password && uf.password2) && uf.password == uf.password2) {
            uf.user.password = uf.password;
        }
        var promise;
        if (uf.user.id) {
            promise = $rpc.users.update(uf.user.id, uf.user);
        } else {
            promise = $rpc.users.new(uf.user);
        }
        promise.then(function (res) {
            uf.user = res.data;
            uf.userId = uf.user.id;
            $toaster.pop('success', "User saved!");
            $spinner.off('.spinner');
        }, function (err) {
            $toaster.pop('success', "Something went wrong!");
        })
    }

    function deleteUser() {
        $spinner.on('.spinner');
        ngDialog.openConfirm({ template: 'deleteModal' })
            .then(function () {
                $rpc.users.delete(uf.user.id)
                    .then(function (res) {
                        $toaster.pop('success', "User deleted!");
                        $spinner.off('.spinner');
                        $state.go('app.users.list')
                    }, function (err) {
                        $toaster.pop('success', "Something went wrong!");
                    })
            }, function () {
                $spinner.off('.spinner');
            });
    }

    init();
}