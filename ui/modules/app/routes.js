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
            templateUrl: templatePath('users/_list.html'),
            permissions: ['admin']
        })
        .state('app.users.edit', {
            url: '/{id:int}',
            templateUrl: templatePath('users/_form.html'),
            controller: 'UserFormController',
            controllerAs: 'uf',
            permissions: ['admin']
        })
        .state('app.users.new', {
            url: '/new',
            templateUrl: templatePath('users/_form.html'),
            controller: 'UserFormController',
            controllerAs: 'uf',
            permissions: ['admin']
        })
        .state('app.projects', {
            abstract: true,
            url: "/projects",
            templateUrl: templatePath('projects/_main.html')
        })
        .state('app.projects.list', {
            url: '',
            templateUrl: templatePath('projects/_list.html'),
            controller: 'ProjectListController',
            controllerAs: 'pl',
            permissions: []
        })
        .state('app.projects.edit', {
            url: '/{id:int}',
            templateUrl: templatePath('projects/_form.html'),
            controller: 'ProjectFormController',
            controllerAs: 'pf',
            permissions: []
        })
        .state('app.projects.new', {
            url: '/new',
            templateUrl: templatePath('projects/_form.html'),
            controller: 'ProjectFormController',
            controllerAs: 'pf',
            permissions: ['admin', 'poweruser']
        })
        .state('app.projects.logs', {
            url: '/{id:int}/logs',
            templateUrl: templatePath('projects/_logs.html'),
            controller: 'ProjectLogsController',
            controllerAs: 'pl',
            permissions: []
        })
        .state('app.projects.stream', {
            url: '/{id:int}/stream',
            templateUrl: templatePath('projects/_stream.html'),
            controller: 'LogStreamerController',
            controllerAs: 'ps',
            permissions: []
        })
        .state('app.errors', {
            abstract: true,
            url: "/errors",
            templateUrl: templatePath('errors/_main.html')
        })
        .state('app.errors.list', {
            url: '?pid',
            templateUrl: templatePath('errors/_list.html'),
            controller: 'ErrorListController',
            controllerAs: 'el',
            permissions: []
        })
        .state('app.errors.info', {
            url: '/{id:int}',
            templateUrl: templatePath('errors/_info.html'),
            controller: 'ErrorInfoController',
            controllerAs: 'ei',
            permissions: []
        })
        .state('app.events', {
            abstract: true,
            url: "/events",
            templateUrl: templatePath('events/_main.html')
        })
        .state('app.events.list', {
            url: '?pid',
            templateUrl: templatePath('events/_list.html'),
            controller: 'EventListController',
            controllerAs: 'evl',
            permissions: []
        })
        .state('app.events.info', {
            url: '/{id:int}',
            templateUrl: templatePath('events/_info.html'),
            controller: 'EventInfoController',
            controllerAs: 'evi',
            permissions: []
        });
        
    

    function templatePath(uri) {
        return 'views/' + uri;
    }
}

