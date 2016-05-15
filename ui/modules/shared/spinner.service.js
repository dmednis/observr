app.factory('SpinnerService', [SpinnerService]);

function SpinnerService () {

    var spinner = {};

    spinner.on = function (element) {
        angular.element(element).addClass('whirl traditional');
    };

    spinner.off = function(element) {
         angular.element(element).removeClass('whirl traditional');
    };

    return spinner;

}
