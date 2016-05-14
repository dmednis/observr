app.run(['$rootScope', function ($rootScope) {
    $rootScope.menu = [
        {
            title: "Dashboard",
            icon: "fa fa-dashboard",
            target: "app.dashboard"
        },
        {
            title: "Projects",
            icon: "fa fa-book",
            target: "app.projects.list"
        },
        {
            title: "Administration",
            icon: "fa fa-wrench",
            submenu: [
                {
                    title: "Users",
                    target: "app.test"
                }
            ]
        }
    ];
}]);