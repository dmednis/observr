var _ = require("lodash");

module.exports = {
    classMethods: {
        /**
         *
         * @param filters
         * @param model
         * @returns {Array}
         */
        buildSequelizeQuery: function (filters, model) {
            var seqQuery = [];
            var fieldMap = model.described;
            for (var key in filters) {
                if (filters.hasOwnProperty(key)) {
                    var filter = {};
                    filter[key] = {};
                    if (!Array.isArray(filters[key])) {
                        filters[key] = [filters[key]]
                    }
                    _.forEach(filters[key], function (param) {
                        if (param != null) {
                            if (typeof param == 'object' && !_.isEmpty(param)) {
                                param = param.id;
                            }
                            if (fieldMap[key]) {
                                var map = fieldMap[key].type;
                                switch (map) {
                                    case 'INTEGER':
                                        if (!filter[key].$in) {
                                            filter[key].$in = [];
                                        }
                                        var term = Number(param);
                                        if (!isNaN(term)) {
                                            filter[key].$in.push(term);
                                        } else {
                                            console.log("NOT AN INTEGER");
                                        }
                                        break;
                                    case 'CHARACTER VARYING':
                                        if (!filter[key].$or) {
                                            filter[key].$or = [];
                                        }
                                        if (param === false) {
                                            filter[key].$or.push({$eq: null});
                                        } else if (param === true) {
                                            filter[key].$or.push({$ne: null});
                                        } else {
                                            filter[key].$or.push({$ilike: '%' + param + '%'});
                                        }
                                        break;
                                    case 'BOOLEAN':
                                        switch (param) {
                                            case 1:
                                                filter[key] = true;
                                                break;
                                            case 0:
                                                filter[key] = false;
                                                break;
                                            case "true":
                                                filter[key] = true;
                                                break;
                                            case "false":
                                                filter[key] = false;
                                                break;
                                            case null:
                                                filter[key] = {};
                                                break;
                                            default :
                                                filter[key] = (Boolean(param));
                                                break;
                                        }
                                        break;
                                    case 'USER-DEFINED':
                                        if (!filter[key].$in) {
                                            filter[key].$in = [];
                                        }
                                        if (param) {
                                            filter[key].$in.push(param);
                                        }
                                        break;
                                    case 'TIMESTAMP WITH TIME ZONE':
                                        switch (param) {
                                            case null:
                                                filter[key] = {$eq: null};
                                                break;
                                            case true:
                                                filter[key] = {$ne: null};
                                                break;
                                            default :
                                                break;
                                        }
                                        break;
                                    //TODO: 'JSONB', 'TIMESTAMP WITH TIME ZONE', 'ARRAY', 'FLOAT'
                                    default:
                                        break;
                                }
                            }
                        }
                    });
                    if ((typeof filter[key] == 'object' && !_.isEmpty(filter[key])) || typeof filter[key] != 'object') {

                        //console.log("FILTER=========================", key, fieldMap[key].type);
                        //console.dir(filter, {depth: 7});
                        //console.log("===============================");

                        if (filter) {
                            seqQuery.push(filter);
                        }
                    }
                }
            }

            return seqQuery;
        },


        /**
         *
         * @param search
         * @param model
         * @returns {{}}
         */
        parseSearchParams: function (search, model) {
            var searchParams = {};
            var searchMap = model.options.searchMap;

            //console.log("SEARCHMAP======================");
            //console.log(searchMap);
            //console.log("==============================");

            if (searchMap) {
                _.forEach(searchMap, function (field) {
                    searchParams[field] = search;
                });
            }

            return searchParams;
        },


        /**
         *
         * @param combinedFilters
         * @param model
         * @returns {{}}
         */
        parseCombinedFilters: function (combinedFilters, model) {
            var combinedFilterParams = {};
            var filtersMap = model.options.filtersMap;

            //console.log("FILTERSMAP======================");
            //console.log(filtersMap);
            //console.log("==============================");

            if (filtersMap) {
                _.forOwn(combinedFilters, function (value, filter) {
                    _.forEach(filtersMap[filter], function (field) {
                        combinedFilterParams[field] = value;
                    });
                });
            }

            return combinedFilterParams;
        },


        /**
         *
         * @param params
         * @param overwrites
         * @param model
         * @returns {{offset: *, limit: number, where: {}, order: Array}}
         */
        makeGenericQuery: function (params, overwrites, model) {
            if (!model) {
                model = this;
            }
            console.log('11', model);

            var query = {
                offset: params.offset ? params.offset : 0,
                limit: params.limit ? params.limit : 10,
                where: {},
                order: []
            };

            if (params.deleted) {
                query.paranoid = false;
            }

            if (params.order_by) {
                query.order = [[params.order_by, params.order_dir]];
            }

            if (params.search) {
                var search = this.buildSequelizeQuery(this.parseSearchParams(params.search, model), model);
                if (search) {
                    if (!query.where.$or) {
                        query.where.$or = [];
                    }
                    query.where.$or = search;
                }
            }
            console.log('22');
            if (params.combinedFilters) {
                var combinedFilters = this.buildSequelizeQuery(this.parseCombinedFilters(params.combinedFilters, model), model);
                if (combinedFilters) {
                    if (!query.where.$or) {
                        query.where.$or = [];
                    }
                    query.where.$or = _.union(query.where.$or, combinedFilters);
                }
            }
            console.log(33);
            if (params.filters) {
                console.log(111);
                var filters = this.buildSequelizeQuery(params.filters, model);
                console.log(222);
                if (filters) {
                    var unionArray = _.union(query.where.$and, filters);
                    console.log(333);

                    if (unionArray.length) {
                        if (!query.where.$and) {
                            query.where.$and = [];
                        }
                        query.where.$and = unionArray;
                    }
                }
            }
            console.log(444);
            console.log('query', query);
            console.log('overwrites', overwrites);
            console.log(_.VERSION);
            process.on('uncaughtException', function (err) {
                console.log('Caught exception: ' + err);
            });
            try {
                query = _.merge(query, overwrites);
            } catch (e) {
                console.log(e);
            }

            console.log(44);
            return query;
        }
    }
};