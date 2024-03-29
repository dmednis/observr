var Promise = require('bluebird');

/**
 *
 * Serves endpoints for web client.
 *
 * @param _app
 * @param router
 * @returns {RPCProvider}
 * @constructor
 */
function RPCProvider(_app, router) {
    this.app = _app;
    var that = this;

    router.get('/rpc', this.serve.bind(this));

    return this;
}

RPCProvider.prototype.serve = function (req, res) {
    function makeFunc(func) {
        if (['list'].indexOf(func.name) > -1) {
            return "function(data,config){" +
                "var params={params:data}; " +
                "return $http." + func.method + "('api" + func.url + "\',_.assign(params,config));" +
                "}";
        } else if (['get'].indexOf(func.name) > -1) {
            return "function(id,data,config){" +
                "var params={params:data}; " +
                "return $http." + func.method + "('api" + func.url.split(":")[0] + "\'+id,_.assign(params,config));}";
        } else if (['new'].indexOf(func.name) > -1) {
            return "function(data,config){" +
                "var params={params:data}; " +
                "return $http." + func.method + "('api" + func.url.split(":")[0] + "\',data,config);}";
        }
        else if (['update', 'delete'].indexOf(func.name) > -1) {
            return "function(id,data,config){" +
                "var params={params:data}; " +
                "return $http." + func.method + "('api" + func.url.split(":")[0] + "\'+id,data,config);}";
        } else {
            return "function(data,config){" +
                "return $http." + func.method + "('api" + func.url + "\',data,config);" +
                "}";
        }
    }

    var js = [];
    js.push("var RPC = angular.module('RPC', ['ng']); angular.module('RPC').provider('$rpc', function(){ this.$get=['$http',function($http) {");

    var routes = this.app.routes;
    var endpoints = {};
    for (var r = 0; r < routes.length; r++) {
        var route = routes[r];
        if (!endpoints[route.ctrlName]) {
            endpoints[route.ctrlName] = [];
        }
        endpoints[route.ctrlName].push(route)
    }
    for (var ctr in endpoints) {
        js.push('this.' + ctr + '={');
        var funcs = [];
        for (var func in endpoints[ctr]) {
            funcs.push(endpoints[ctr][func].name + ':' + makeFunc(endpoints[ctr][func]));
        }
        js.push(funcs.join(',\n'));
        js.push('};');
    }
    js.push("return this; }]; return this; });");
    res.setHeader('Content-Type', 'text/javascript');
    res.send(js.join('\n'));
};

module.exports = RPCProvider;