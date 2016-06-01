app.run(['$rootScope', function ($rootScope) {
    $rootScope.$on('$viewContentLoaded', function () {
        angular.element(window).resize();
    })
}]);

app.config(['$localStorageProvider', function ($localStorageProvider) {
    $localStorageProvider.setKeyPrefix('officer');
}]);

app.run(['$rpc', '$rootScope', '$state', 'AuthService', '$localStorage', 'toaster', function ($rpc, $rootScope, $state, Auth, $localStorage, toaster) {
    var auth_progress = false;
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (auth_progress == false && !$rootScope.user.id && toState.name != "login") {
            event.preventDefault();
            auth_progress = true;
            Auth.getUser().then(function (res) {
                    if (res.data.user) {
                        $rootScope.user = res.data.user;
                        Auth.user = res.data.user;
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
            $state.go('app.dashboard');
        } else {
            if (!Auth.hasAccess(toState)) {
                event.preventDefault();
                toaster.pop('error', 'Access denied');
                $state.go('app.dashboard');
            }
        }
    });
    
}]);