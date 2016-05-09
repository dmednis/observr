var app = angular.module('officer', [
    'ui.router',
    //'ui.bootstrap',
    // 'RPC',
    // 'toaster',
    // 'dm.select2',
    // 'ngDialog'
]);
app.controller('AppController', ['$rootScope', '$scope', '$state', '$window', '$timeout', AppController]);

function AppController($rootScope, $scope, $state, $window, $timeout) {
    "use strict";

}
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
            templateUrl: templatePath('app/_app.html'),
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


app.controller('LoginController', ['$scope', '$state', LoginController]);

function LoginController($scope, $state) {
    "use strict";

}