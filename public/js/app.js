var app = angular.module('officer', [
    'ui.router',
    'LocalStorageModule',
    //'ui.bootstrap',
    'RPC',
    // 'toaster',
    // 'dm.select2',
    // 'ngDialog'
]);
app.controller('AppController', ['$rootScope', '$scope', '$state', '$window', '$timeout', AppController]);

function AppController($rootScope, $scope, $state, $window, $timeout) {
    "use strict";

}
app.run(['$rootScope', function ($rootScope) {
    $rootScope.$on('$viewContentLoaded', function () {
        angular.element(window).resize();
    })
}]);

app.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('officer');
});
app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', routesConfig]);

function routesConfig($stateProvider, $locationProvider, $urlRouterProvider) {
    'use strict';
    // Set the following to true to enable the HTML5 Mode
    // You may have to set <base> tag in index and a routing configuration in your server
    $locationProvider.html5Mode(false);

    // default route
    $urlRouterProvider.otherwise('/login');
    //
    // Application Routes
    // ----------------------------------
    $stateProvider
        .state('app', {
            url: '',
            abstract: true,
            templateUrl: templatePath('app/_layout.html'),
            controller: 'AppController'
        })
        .state('login', {
            url: '/login',
            title: 'Login',
            templateUrl: templatePath('login/_login.html'),
            controller: 'LoginController',
            controllerAs: 'lc'
        })
        .state('app.home', {
            url: '/',
            title: 'Home',
            templateUrl: templatePath('dashboard/_dashboard.html')
        });
        
    

    function templatePath(uri) {
        return 'views/' + uri;
    }
}


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
/**
 * Created by Dāvis on 13.05.2016.
 */

/**
 * Created by Dāvis on 13.05.2016.
 */

/**
 * Created by Dāvis on 13.05.2016.
 */
