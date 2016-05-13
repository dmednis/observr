app.factory('AuthService', ['$rootScope', '$http', '$rpc', '$q', 'localStorageService', AuthService]);

function AuthService($rootScope, $http, $rpc, $q, $localStorage) {
    'use strict';
    var service = {};

    service.login = function (username, password, callback) {
        $rpc.auth.login({user: username, pass: password})
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
        var def = $q.defer();
        if ($localStorage.get('token')) {
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + $localStorage.get('token');
        }
        $rpc.auth.user()
            .then(function (res) {
                $rootScope.user = res.data.user;
                def.resolve($rootScope.user);
            }, function (err) {
                def.reject(err);
            });

        return def.promise;
    };

    service.setCredentials = function (user, token) {
        $rootScope.user = user;
        $localStorage.set('token', token);
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + token; 
    };

    service.clearCredentials = function () {
        $rootScope.user = {};
        $localStorage.remove('token');
        $http.defaults.headers.common.Authorization = 'Bearer ';
        delete $http.defaults.headers.common.Authorization;
    };

    return service;
}
