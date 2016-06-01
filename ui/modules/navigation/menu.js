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
            title: "Errors",
            icon: "fa fa-bug",
            target: "app.errors.list"
        },
        {
            title: "Events",
            icon: "fa fa-flag",
            target: "app.events.list"
        },
        {
            title: "Administration",
            icon: "fa fa-wrench",
            submenu: [
                {
                    title: "Users",
                    target: "app.users.list"
                },
                {
                    title: "System logs",
                    target: "app.system.logs"
                },
                {
                    title: "E-mails",
                    target: "app.system.emails"
                }
            ]
        }
    ];
}]);