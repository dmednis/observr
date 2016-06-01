app.controller('GridController', ['$scope', '$rootScope', '$filter', '$attrs', '$rpc', '$localStorage', 'SpinnerService', 'toaster', '$state', GridController]);

function GridController($scope, $rootScope, $filter, $attrs, $rpc, $localStorage, SpinnerService, toaster, $state) {
    var grid = this;

    //VARIABLES
    grid.rows = [];
    grid.checked = false;
    grid.checkedCount = 0;

    grid.spinner = false;
    grid.error = false;

    grid.last_page = 1;
    grid.page = 1;

    grid.loaded = false;

    grid.total = 0;
    grid.sort = {
        reversed: {},
        sort_key: null
    };

    if ($attrs.perPage) {
        grid.per_page = $attrs.perPage;
    } else {
        grid.per_page = 10;
    }

    if ($attrs.loadOnStart) {
        if ($attrs.loadOnStart == 'false') {
            grid.loadOnStart = false;
        } else {
            grid.loadOnStart = $attrs.loadOnStart;
        }
    } else {
        grid.loadOnStart = true;
    }

    grid.static_filters = {};
    grid.static_customFilters = {};
    

    grid.params = {
        order_by: 'id',
        order_dir: 'asc',
        filters: {},
        customFilters: {}
    };

    //METHODS
    grid.init = init;
    grid.loadData = loadData;

    grid.sortBy = sortBy;
    grid.filter = filter;
    grid.resetFilters = resetFilters;

    grid.pagainate = pagainate;

    grid.checkedRows = {};
    grid.checkAll = checkAll;

    grid.test = test;
    grid.countChecked = countChecked;
    grid.uncheckAll = uncheckAll;
    

    /* debug */
    var peekBox;
    grid.peek = function (row) {
        function mini_render(row) {
            var trs = [];
            for (var fn in row) {
                trs.push('<tr><td>' + fn + '</td><td>' + (typeof row[fn] == 'object' ? '_object_' : JSON.stringify(row[fn])) + '</td>');

            }
            return '<table>' + trs.join('') + '</table>';
        }

        if (!peekBox) {
            peekBox = $('#peekBox');
            if (peekBox.length === 0) {
                peekBox = $('<div id="peekBox"></div>');
                $('body').prepend(peekBox);
            }
        }
        if (row === null) {
            peekBox.hide();
        } else {
            if (peekBox.id != row.id) {
                peekBox.html(mini_render(row));
                peekBox.id = row.id;
                if (event && event.pageX) {
                    peekBox.css('left', event.pageX - 440);
                    peekBox.css('top', Math.max(Math.min($(window).height() - peekBox.height() - 100, event.pageY), 50));
                }
            }
            peekBox.show();
        }
    };


    grid.keyDown = function (event) {
        if (event.keyCode == 13) filter();
    };

    //LISTENERS AND WATCHERS
    $scope.$on('refresh_grid', function (event, args) {
        if (args == $attrs.alias || args.alias == $attrs.alias) {
            loadData();
        }
    });

    $scope.$on('set_search', function (event, args) {
        if (args.alias == $attrs.alias) {
            grid.search = args.search;
            filter();
        }
    });

    $scope.$on('set_filters', function (event, args) {
        if (args.alias == $attrs.alias) {
            if (args.filters) {
                grid.params.filters = angular.extend(grid.params.filters, args.filters);
            }
            if (args.customFilters) {
                grid.params.customFilters = angular.extend(grid.params.customFilters, args.customFilters);
            }
            filter();
        }
    });

    $scope.$on('set_static_filters', function (event, args) {
        if (args.alias == $attrs.alias) {
            //console.log("static_filters_received", args);
            if (args.filters) {
                grid.static_filters = args.filters;
            }
            if (args.customFilters) {
                grid.static_customFilters = args.customFilters;
            }
            filter();
        }
    });

    function test() {

    }

    //REALISATION

    function init() {
        if (grid.loadOnStart) {
            loadData();
        }
    }

    function loadData(spinner) {
        grid.error = false;
        if (typeof(spinner) === 'undefined') {
            spinner = true;
        }
        if (spinner) {
            SpinnerService.on('.spinner');
        }

        var params = grid.params;
        params.offset = (grid.page - 1) * grid.per_page;
        params.limit = grid.per_page;
        params.doCount = false;


        if (typeof $attrs.docount != "undefined" && $attrs.docount == "true") {
            params.doCount = true;
        }
        
        params.filters = angular.extend(params.filters, grid.static_filters);
        params.customFilters = angular.extend(params.customFilters, grid.static_customFilters);

        if (grid.search) {
            params.search = grid.search;
        } else {
            delete params.search;
        }

        $rpc[$attrs.module][$attrs.method || 'list'](grid.params)
            .then(function (response) {
                if (!response.data || !response.data.rows) {
                    grid.rows = [];
                    grid.error = true;
                } else {
                    grid.rows = response.data.rows;

                    if (response.data.took) {
                        grid.took = response.data.took;
                    }

                    if (response.data.count !== undefined && response.data.count != -1) {
                        grid.total = response.data.count;
                    }
                    else if (params.offset === 0) {
                        // async count
                        grid.total = 'counting...';
                        console.time('count ' + $attrs.module);
                        var count_params = angular.copy(grid.params);
                        count_params.onlyCount = true;
                        $rpc[$attrs.module].list(count_params)
                            .then(function (cResponse) {
                                    console.timeEnd('count ' + $attrs.module);
                                    if (cResponse.data.count !== undefined && cResponse.data.count != -1) grid.total = cResponse.data.count;
                                }
                            );
                        //end async count
                    }
                    grid.checked = false;
                }
                grid.loaded = true;
                SpinnerService.off('.spinner');
            }, function (err) {
                grid.rows = [];
                grid.error = true;
                grid.loaded = true;
                SpinnerService.off('.spinner');
                toaster.pop("error", "Server error");
            });


    }

    function sortBy(key, sortable) {
        if (typeof(sortable) === 'undefined') {
            sortable = true;
        } else {
            sortable = eval(sortable)
        }
        if (sortable) {
            var params = grid.params;

            grid.sort.sort_key = key;

            if (params.order_by == key) {
                params.order_dir = params.order_dir == 'asc' ? 'desc' : 'asc';

                grid.sort.reversed[key] = params.order_dir == 'asc' ? false : true;
            } else {
                params.order_by = key;
                params.order_dir = 'asc';
                grid.sort.reversed[key] = false;
            }
            loadData();
        }
    }

    var filterLock = false;
    var filterDirty = false;

    function filter() {
        if (!filterLock) {
            var filters = {};
            _.forOwn(grid.params.filters, function(value, key) {
                if (value !== "") {
                    filters[key] = value;
                }
            });
            grid.params.filters = filters;
            grid.page = 1;
            saveFilters();
            loadData();
            filterDirty = false;
        } else filterDirty = true;
        clearTimeout(filterLock);
        filterLock = setTimeout(function () {
            filterLock = false;
            if (filterDirty) filter();
        }, 800);
    }

    function saveFilters() {
        if($attrs.saveFilters) {
            if (!$localStorage["user_" + $rootScope.user.username]) {
                $localStorage["user_" + $rootScope.user.username] = {};
            }
            if (!$localStorage["user_" + $rootScope.user.username].dm_grid_filters) {
                $localStorage["user_" + $rootScope.user.username].dm_grid_filters = {};
            }
            var filterCache = $localStorage["user_" + $rootScope.user.username].dm_grid_filters;
            if (!filterCache[$state.current.name + "_" + $attrs.alias]) {
                filterCache[$state.current.name + "_" + $attrs.alias] = {filters: {}, customFilters: {}, search: ""};
            }
            var currFC = filterCache[$state.current.name + "_" + $attrs.alias];
            currFC.filters = grid.params.filters;
            currFC.customFilters = grid.params.customFilters;
            currFC.search = grid.params.search;
        }
    }

    function getFilters() {
       if($attrs.saveFilters) {
           if ($localStorage["user_" + $rootScope.user.username] && $localStorage["user_" + $rootScope.user.username].dm_grid_filters && $localStorage["user_" + $rootScope.user.username].dm_grid_filters[$state.current.name + "_" + $attrs.alias]) {
               if ($localStorage["user_" + $rootScope.user.username].dm_grid_filters[$state.current.name + "_" + $attrs.alias].filters) {
                   grid.params.filters = $localStorage["user_" + $rootScope.user.username].dm_grid_filters[$state.current.name + "_" + $attrs.alias].filters;
                   grid.params.customFilters = $localStorage["user_" + $rootScope.user.username].dm_grid_filters[$state.current.name + "_" + $attrs.alias].customFilters;
                   grid.params.search = $localStorage["user_" + $rootScope.user.username].dm_grid_filters[$state.current.name + "_" + $attrs.alias].search;
               }
           }
       }
    }

    function resetFilters(filters) {
        if (typeof filters == 'undefined') {
            grid.params.filters = angular.extend({}, grid.static_filters);
            grid.params.customFilters = angular.extend({}, grid.static_customFilters);
            delete grid.params.combinedFilters;
        } else {
            if (filters.filters) {
                filters.filters.forEach(function (filter) {
                    delete grid.params.filters[filter]
                });
            }
            if (filters.customFilters) {
                filters.customFilters.forEach(function (filter) {
                    delete grid.params.customFilters[filter]
                });
            }
        }

        grid.filter();
    }

    function pagainate(page) {
        if (page === 'prev') {
            page = grid.page - 1;
        }
        if (page === 'next') {
            page = grid.page + 1;
        }
        if (page < 1) {
            page = 1;
        }
        if (page > grid.last_page) {
            page = grid.last_page;
        }
        grid.page = page;
        loadData();
        if (!Object.keys(grid.checkedRows).length) {
            grid.checkedCount = 0;
        }
    }
    
    function checkAll() {
        grid.checked = grid.checked ? false : true;

        grid.rows.forEach(function (row) {
            row.checked = grid.checked;
        });
        grid.countChecked()
    }

    function uncheckAll() {
        grid.rows.forEach(function (row) {
            row.checked = false;
        });
        grid.countChecked();
        getCheckState();
    }

    function countChecked() {
        grid.checkedCount = 0;
        grid.rows.forEach(function (row) {
            if (row.checked) {
                grid.checkedCount++;
            }
        });
    }

    init();
}
