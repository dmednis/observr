app.factory('AuthService', ['$rootScope', '$http', '$rpc', '$q', '$localStorage', AuthService]);

function AuthService($rootScope, $http, $rpc, $q, $localStorage) {
    'use strict';
    var service = {};

    service.login = function (username, password, callback) {
        $rpc.auth.login({username: username, password: password})
            .then(function (res) {
                if (res.data && res.data.user && res.data.token) {
                    callback({success: true, data: res.data});
                }
            }, function (err) {
                switch (err.status) {
                    case 401:
                        callback({error: 'Invalid credentials'});
                        break;
                    default:
                        callback({error: 'Server error'});
                        break;
                }
            });
    };

    service.getUser = function () {
        if ($localStorage.token) {
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + $localStorage.token;
        }
        return $rpc.auth.user();
    };

    service.checkPerms = function (state) {


        return true;
    };

    service.setCredentials = function (user, token) {
        $rootScope.user = user;
        $localStorage.token = token;
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + token; 
    };

    service.clearCredentials = function () {
        $rootScope.user = {};
        delete $localStorage.token;
        $http.defaults.headers.common.Authorization = 'Bearer ';
        delete $http.defaults.headers.common.Authorization;
    };

    return service;
}
