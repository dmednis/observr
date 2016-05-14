app.controller('HeaderController', ['$rootScope', '$scope', '$state', 'AuthService', HeaderController]);

function HeaderController($rootScope, $scope, $state, Auth) {
    "use strict";
    var h = this;

    h.user = $rootScope.user;

    h.logout = logout;

    function logout() {
        Auth.clearCredentials();
        $state.go('login');
    }
}