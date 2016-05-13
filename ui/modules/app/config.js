app.run(['$rootScope', function ($rootScope) {
    $rootScope.$on('$viewContentLoaded', function () {
        angular.element(window).resize();
    })
}]);

app.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('officer');
});