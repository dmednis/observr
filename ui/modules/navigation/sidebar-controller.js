app.controller('SidebarController', ['$rootScope', '$scope', '$state', SidebarController]);

function SidebarController($rootScope, $scope, $state) {
    "use strict";
    var sb = this;
    
    sb.user = $rootScope.user;

    function init() {
        var menu = [];
        var statesArr = $state.get();

        var statesObj = {};

        for (var s = 0; s < statesArr.length; s++) {
            var state = statesArr[s];
            if (state.name) {
                statesObj[state.name] = state;
            }
        }

        for (var m = 0; m < $rootScope.menu.length; m++) {
            var mItem = $rootScope.menu[m];
            mItem.id = m;
            var mParsed = {};
            if (mItem.submenu && mItem.submenu.length) {
                mParsed.submenu = [];
                for (var sm = 0; sm < mItem.submenu.length; sm++) {
                    var smItem = mItem.submenu[sm];
                    smItem.id = sm;
                    mParsed.submenu.push(smItem);
                }
                if (mParsed.submenu.length) {
                    mParsed.title = mItem.title;
                    mParsed.icon = mItem.icon;
                    mParsed.id = mItem.id;
                    menu.push(mParsed);
                }
            } else {
                if (mItem.target) {
                    menu.push(mItem);
                }
            }
        }

        sb.menu = menu;
    }

    init();
}