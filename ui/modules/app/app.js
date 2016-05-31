var app = angular.module('officer', [
    'ui.router',
    'ngStorage',
    'ui.bootstrap.pagination',
    'uib/template/pagination/pagination.html',
    'ui.bootstrap.tabs',
    'uib/template/tabs/tabset.html',
    'uib/template/tabs/tab.html',
    'RPC',
    'toaster',
    'dm.select2',
    'ngDialog',
    'btford.socket-io'
]);

app.run(["$rootScope", "$state", "$stateParams", function ($rootScope, $state, $stateParams) {

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.app = {
        name: 'Observr',
        description: 'All your logs are belong to us!',
        year: ((new Date()).getFullYear())
    };

    $rootScope.user = {};
}]);