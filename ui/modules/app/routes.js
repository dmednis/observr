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
            controller: 'AppController',
            controllerAs: 'app'
        })
        .state('login', {
            url: '/login',
            templateUrl: templatePath('login/_login.html'),
            controller: 'LoginController',
            controllerAs: 'lc'
        })
        .state('app.dashboard', {
            url: '/',
            templateUrl: templatePath('dashboard/_dashboard.html')
        })
        .state('app.test', {
            url: '/ul',
            templateUrl: templatePath('dashboard/_dashboard.html')
        });
        
    

    function templatePath(uri) {
        return 'views/' + uri;
    }
}

