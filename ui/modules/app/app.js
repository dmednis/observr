var app = angular.module('officer', [
    'ui.router',
    'ngStorage',
    'ui.bootstrap.pagination',
    'ui.bootstrap.tabs',
    'RPC',
    'toaster',
    'dm.select2',
    'ngDialog'
]);

app.run(["$rootScope", "$state", "$stateParams", function ($rootScope, $state, $stateParams) {

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.app = {
        name: 'OFFICER',
        description: 'Catching your errors',
        year: ((new Date()).getFullYear())
    };

    $rootScope.user = {};
}]);