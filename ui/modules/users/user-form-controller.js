app.controller('UserFormController', ['$scope', '$rootScope', '$state', '$stateParams', '$rpc', 'SpinnerService', UserFormController]);

function UserFormController($scope, $rootScope, $state, $stateParams, $rpc, $spinner) {
    "use strict";

    var uf = this;

    var authUser = $rootScope.user;
    var state = $state.current.name;

    if (state == "app.users.profile") {
        uf.userId = authUser.id;
    } else if (state == "app.users.edit") {
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

    }

    function deleteUser() {

    }

    init();
}