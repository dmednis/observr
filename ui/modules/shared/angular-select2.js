angular.module("dm.select2", [])
    .value("select2Config", {})
    .factory("select2Stack", function () {
        var stack = [];

        return {
            $register: function (callbackElem) {
                stack.push(callbackElem);
            },
            $unregister: function (callbackElem) {
                var idx = stack.indexOf(callbackElem);
                if (idx !== -1) {
                    stack.splice(idx, 1);
                }
            },
            closeAll: function () {
                stack.forEach(function (elem) {
                    elem.close();
                });
            }
        };
    })
    .directive("select2", ["$rootScope", "$timeout", "$parse", "$filter", "select2Config", "select2Stack", function ($rootScope, $timeout, $parse, $filter, select2Config, select2Stack) {
        "use strict";

        var filter = $filter("filter");

        function sortedKeys(obj) {
            var keys = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
            return keys.sort();
        }

        var defaultOptions = {};
                               //0000111110000000000022220000000000000000000000333300000000000000444444444444444000000000555555555555555000000066666666666666600000000000000007777000000000000000000088888
        var NG_OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/;

        if (select2Config) {
            angular.extend(defaultOptions, select2Config);
        }

        return {
            require: "ngModel",
            priority: 1,
            restrict: "E",
            template: "<input type=\"hidden\"></input>",
            replace: true,
            link: function (scope, element, attrs, controller) {
                var getOptions;

                var opts = angular.extend({}, defaultOptions, scope.$eval(attrs.options));

                var isMultiple = angular.isDefined(attrs.multiple) || opts.multiple;
                opts.multiple = isMultiple;

                if (attrs.placeholder) {
                    opts.placeholder = attrs.placeholder;
                }

                if (opts.onlyId) {
                    controller.$parsers.push(function (value) {
                        if (!value) {
                            return null;
                        }
                        if (Array.isArray(value)) {
                            var results = [];
                            for (var i = 0; i < value.length; i++) {
                                if (value[i].id) {
                                    results.push(value[i].id);
                                } else {
                                    console.warn("Invalid value -  no ID")
                                }
                            }
                            return results;
                        } else {
                            return value.id ? value.id : value;
                        }
                    });
                }

                var filterOptions = $parse(attrs.optionsFilter);

                // All values returned from Select2 are strings. This is a
                // problem if you supply integer indexes: they'll become
                // strings once passing through this directive. We keep a
                // mapping between string keys and values through the
                // optionItems object, to be able to return the correctly typed
                // value.
                var optionItems = {};

                function filterValues(values) {
                    if (filterOptions) {
                        var filterParams = filterOptions(scope);
                        if (filterParams) {
                            return filter(values, filterParams);
                        }
                    }

                    return values;
                }

                if (attrs.s2Options) {
                    var match;
                    if (!(match = attrs.s2Options.match(NG_OPTIONS_REGEXP))) {
                        throw new Error("Invalid s2Options encountered!");
                    }

                    var displayFn = $parse(match[2] || match[1]);
                    var valuesFn = $parse(match[7]);
                    var valueName = match[4] || match[6];
                    var valueFn = $parse(match[2] ? match[1] : valueName);
                    var keyName = match[5];

                    getOptions = function (callback) {
                        optionItems = {};
                        var values = filterValues(valuesFn(scope));
                        var keys = (keyName ? sortedKeys(values) : values) || [];

                        var options = [];
                        for (var i = 0; i < keys.length; i++) {
                            var locals = {};
                            var key = i;
                            if (keyName) {
                                key = keys[i];
                                locals[keyName] = key;
                            }
                            locals[valueName] = values[key];

                            var value = valueFn(scope, locals);
                            var label = displayFn(scope, locals) || "";

                            // Select2 returns strings, we use a dictionary to get
                            // back to the original value.
                            optionItems[value] = {
                                id: value,
                                text: label,
                                obj: values[key]
                            };

                            options.push(optionItems[value]);
                        }

                        callback(options);
                    };

                    opts.query = function (query) {
                        var values = filterValues(valuesFn(scope));
                        var keys = (keyName ? sortedKeys(values) : values) || [];

                        var options = [];
                        for (var i = 0; i < keys.length; i++) {
                            var locals = {};
                            var key = i;
                            if (keyName) {
                                key = keys[i];
                                locals[keyName] = key;
                            }
                            locals[valueName] = values[key];

                            var value = valueFn(scope, locals);
                            var label = displayFn(scope, locals) || "";

                            if (label.toLowerCase().indexOf(query.term.toLowerCase()) > -1) {
                                optionItems[value] = {
                                    id: value,
                                    text: label,
                                    obj: values[key]
                                };
                                options.push({
                                    id: value,
                                    text: label,
                                    obj: values[key]
                                });
                            }
                        }
                        query.callback({
                            results: options
                        });
                    };

                    controller.$render = function () {
                        var select_options = {};

                        getOptions(function(opts) {
                            select_options = optionItems;
                        });

                        getSelection(function (selection) {
                            if (!angular.isObject(selection)) {
                                element.select2("data", select_options[selection]);
                            } else {
                                element.select2("data", selection);
                            }
                        });
                    };

                    // Make sure changes to the options get filled in
                    scope.$watch(match[7], function () {
                        controller.$render();
                    });
                } else {
                    if (!opts.query) {
                        throw new Error("You need to supply a query function!");
                    }

                    scope.$watch(attrs.ngModel +".length", function () {
                        controller.$render();
                    });

                    var queryFn = opts.query;
                    opts.query = function (query) {
                        var cb = query.callback;
                        query.callback = function (data) {
                            for (var i = 0; i < data.results.length; i++) {
                                var result = data.results[i];
                                optionItems[result.id] = result;
                            }
                            cb(data);
                        };
                        queryFn(query);
                    };

                    getOptions = function (callback) {
                        opts.query({
                            term: "",
                            callback: function (query) {
                                callback(query.results);
                            }
                        });
                    };

                    controller.$render = function () {
                        getSelection(function (selection) {
                            element.select2("data", selection);
                        });
                    };
                }

                function getSelection(callback) {
                    callback(controller.$viewValue);
                }

                if (!opts.initSelection) {
                    opts.initSelection = function (element, callback) {
                        getSelection(callback);
                    };
                } else {
                    var _initSelection = opts.initSelection;
                    opts.initSelection = function (element, callback) {
                        _initSelection(element, function (result) {
                            optionItems[result.id] = result;
                            callback(result);
                        });
                    };
                }

                // register with the select2stack
                var controlObj = {
                    close: function () {
                        element.select2("close");
                    }
                };
                select2Stack.$register(controlObj);
                scope.$on("destroy", function () {
                    select2Stack.$unregister(controlObj);
                });

                $timeout(function () {
                    element.select2(opts);
                    element.on("change", function (e) {
                        scope.$apply(function () {
                            var val;
                            if (isMultiple) {
                                var vals = [];
                                for (var i = 0; i < e.val.length; i++) {
                                    val = optionItems[e.val[i]];
                                    if (val) {
                                        vals.push({id: val.id, text: val.text, obj: val.obj});
                                    } else {
                                        if (controller.$viewValue.filter) {
                                            vals.push(controller.$viewValue.filter(function(el){
                                                if (el.id == e.val[i]) {
                                                    return true;
                                                } else {
                                                    return false
                                                }
                                            })[0]);
                                        }
                                    }
                                }
                                controller.$setViewValue(vals);
                            } else {
                                val = optionItems[e.val];

                                controller.$setViewValue(val ? {id: val.id, text: val.text, obj: val.obj} : null);

                            }

                            controller.$render();

                        });
                    });

                    element.on("select2-blur", function () {
                        if (controller.$touched) {
                            return;
                        }

                        scope.$apply(controller.$setTouched);
                    });

                    controller.$render();
                });
            }
        };
    }]);
