app.directive('colHeader', colHeader);

function colHeader() {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            key: '@',
            text: '@',
            sortable: '@',
            click: '&click',
            sort: '='
        },
        template: "<th ng-click=\"click({key: key, sortable: sortable})\">" +
            "{{ ::text }}" +
            "<span ng-if=\"(sort.sort_key && sort.sort_key == key)\">" +
            "<i ng-class=\"(sort.sort_key == key && sort.reversed[key]) ? 'fa fa-sort-desc' : 'fa fa-sort-asc'\"></i>" +
            "</span>" +
            "</th>"
    }
}
