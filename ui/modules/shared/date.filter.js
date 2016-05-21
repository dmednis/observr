app.filter('format_date', function() {
    return function(input, hideTime) {
        if (!input) {
            return;
        }
        var date = new Date(input);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

        if (hideTime) {
            return day + '/' + month + '/' + year;
        } else {
            return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
        }
    };
});
