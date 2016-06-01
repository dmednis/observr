app.directive('elPerm', ['$rootScope', '$rpc', 'AuthService', elPerm]);

function elPerm($rootScope, $rpc, AuthService) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attributes) {
            if ($attributes.elPerm) {
               var allowed = AuthService.hasPermission($attributes.elPerm);
               if (!allowed) {
                   switch ($attributes.permType) {
                       case 'disabled':
                           $element.addClass('disabled');
                           $element.attr('disabled', true);
                           $element.on('click', function (e) {
                               e.preventDefault();
                           });
                           break;
                       case 'dm-disabled':
                           $element.addClass('dm-disabled');
                           $element.on('click', function (e) {
                               e.preventDefault();
                           });
                           break;
                       case 'link':
                           $element.removeAttr('ui-sref');
                           $element.removeAttr('href');
                           $attributes.$set('href', null);
                           $element.on('click', function (e) {
                               e.preventDefault();
                           });
                           break;
                       default:
                           $element.remove();
                           break;
                   }
               }
            } else {
               console.log("ELPERM EMPTY");
               //TODO: ONLY FOR ADMIN
            }
            $scope.$on("$destroy",function() {
               $element.off("click");
            });
        }
    }
}
