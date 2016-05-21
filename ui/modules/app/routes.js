app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', routesConfig]);

function routesConfig($stateProvider, $locationProvider, $urlRouterProvider) {
    'use strict';
    // Set the following to true to enable the HTML5 Mode
    // You may have to set <base> tag in index and a routing configuration in your server
    $locationProvider.html5Mode(false);

    // default route
    $urlRouterProvider.otherwise('/');
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
        .state('app.users', {
            abstract: true,
            url: "/users",
            templateUrl: templatePath('users/_main.html')
        })
        .state('app.users.list', {
            url: '',
            templateUrl: templatePath('users/_list.html')
        })
        .state('app.users.edit', {
            url: '/{id:int}',
            templateUrl: templatePath('users/_form.html'),
            controller: 'UserFormController',
            controllerAs: 'uf'
        })
        .state('app.users.new', {
            url: '/new',
            templateUrl: templatePath('users/_form.html'),
            controller: 'UserFormController',
            controllerAs: 'uf'
        })
        
    

    function templatePath(uri) {
        return 'views/' + uri;
    }
}

