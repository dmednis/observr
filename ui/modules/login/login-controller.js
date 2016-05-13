app.controller('LoginController', ['$scope', '$rootScope', '$state', '$localStorage', '$location', '$http', 'AuthService', LoginController]);

function LoginController($scope, $rootScope, $state, $localStorage, $location, $http, Auth) {
    "use strict";

    var lc = this;

    //fckin magic
    //prevents chrome from pre-rendering page
    if (document.webkitVisibilityState == 'prerender' ||  document.visibilityState == 'prerender' || document.visibilityState[0] == 'prerender') {
        alert('no thanks google');
    }

    Auth.clearCredentials();

    lc.login = function () {
        lc.authMessage = '';
        
        if (lc.loginForm.$valid) {
            Auth.login(lc.username.toLowerCase(), lc.password, function (response) {
                if (response && response.success) {
                    Auth.setCredentials(response.data.user, response.data.token);
                    if ($localStorage.lastPath) {
                        //TODO: implement lastpath
                        $location.path($localStorage.lastPath);
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