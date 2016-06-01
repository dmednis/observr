var _ = require('lodash');
var md5 = require('md5');

function EventsController(_app) {
    this.app = _app;
    this.db = this.app.db;
    this.observr = this.app.services.observr;

    this.name = 'events';
    this.exposed = '*';
    this.public = [];
    this.middleware = {
        register: ['appAuth']
    };

    return this;
}

EventsController.prototype.list = function (params, done, req) {
    var that = this;
    var query = this.db.error.makeGenericQuery(params, {
        include: [
            {
                model: this.db.project,
                as: 'project',
                attributes: ['name']
            }
        ]
    });

    return req.user.getProjects({raw: true})
        .then(function (projects) {
            var allowedProjects = [];
            projects.forEach(function (project) {
                allowedProjects.push(project.id);
            });

            if (params.customFilters) {
                if (!params.customFilters.pid) {
                    query.where.projectId = {$in: allowedProjects};
                } else if (allowedProjects.indexOf(Number(params.customFilters.pid)) >= 0) {
                    query.where.projectId = params.customFilters.pid;
                } else {
                    query.where.projectId = 0;
                }
            }

            return that.db.event.findAndCountAll(query)
                .then(function (events) {
                    done(events);
                });
        });
};

EventsController.prototype.register = function (params, done, req) {
    if (params.event) {
        done({ok: true});
        this.observr.processEvent(req.project, params.event, params.data);
    } else {
        done({ok: false}, 400);
    }
};

EventsController.prototype.get = function (params, done, req) {
    var that = this;
    return req.user.getProjects({raw: true})
        .then(function (projects) {
            var allowedProjects = [];
            projects.forEach(function (project) {
                allowedProjects.push(project.id);
            });

            return that.db.event.findOne({
                where: {id: params.id}
            }).then(function (event) {
                console.log(event.get());
                if (allowedProjects.indexOf(event.projectId)) {
                    done({message: 'access denied'}, 403);
                    return;
                }
                done(event);
            });
        });
};

module.exports = EventsController;