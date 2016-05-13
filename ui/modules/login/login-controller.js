app.controller('LoginController', ['$scope', '$state', 'localStorageService', '$location', 'AuthService', LoginController]);

function LoginController($scope, $state, $localStorage, $location, Auth) {
    "use strict";

    var lc = this;

    Auth.clearCredentials();

    lc.login = function () {
        lc.authMessage = '';
        
        if (lc.loginForm.$valid) {
            Auth.login(lc.username.toLowerCase(), lc.password, function (response) {
                if (response && response.success) {
                    Auth.setCredentials(response.data);
                    if ($localStorage.get('lastPath')) {
                        //TODO: implement lastpath
                        $location.path($localStorage.get('lastPath'));
                    } else {
                        $state.go('app.home');
                    }
                } else if (response && response.error){
                    lc.authMsg = response.error || 'Error';
                } else {
                    lc.authMsg = 'Error';
                }
            });
        } else {
            lc.authMessage = 'Username and password are required!';
        }
    };



}