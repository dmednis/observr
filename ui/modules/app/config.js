app.run(['$rootScope', function ($rootScope) {
    $rootScope.$on('$viewContentLoaded', function () {
        angular.element(window).resize();
    })
}]);
window.addEventListener("storage", function(e) {
    console.trace(e);
}, false);
app.config(['$localStorageProvider', function ($localStorageProvider) {
    $localStorageProvider.setKeyPrefix('officer');
}]);

app.run(['$rpc', '$rootScope', '$state', 'AuthService', '$localStorage', function ($rpc, $rootScope, $state, Auth, $localStorage) {
    var auth_progress = false;
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (auth_progress == false && !$rootScope.user.id && toState.name != "login") {
            event.preventDefault();
            auth_progress = true;
            Auth.getUser().then(function (res) {
                    if (res.data.user) {
                        $rootScope.user = res.data.user;
                        auth_progress = false;
                        $state.go(toState.name, toParams);
                    }
                }, function (err) {
                    if (err.status == 401 || err.status == 400) {
                        //TODO: Implement lastpath
                        $state.go('login');
                    } else {
                        console.error(err);
                        $state.go('error');
                    }
                    auth_progress = false;
                });
        } else if (toState.name == "login" && $rootScope.user.id) {
            event.preventDefault();
            $state.go('app.home');
        } else {
            if (!Auth.checkPerms(toState)) {
                event.preventDefault();
                $state.go('404');
            }
        }
    });
    
}]);