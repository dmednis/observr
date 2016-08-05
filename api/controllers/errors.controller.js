var _ = require('lodash');
var md5 = require('md5');


/**
 *
 * ErrorsController. Responsible for ebserved error endpoints.
 *
 * @param _app
 * @returns {ErrorsController}
 * @constructor
 */
function ErrorsController(_app) {
    this.app = _app;
    this.db = this.app.db;
    this.observr = this.app.services.observr;

    this.name = 'errors';
    this.exposed = '*';
    this.public = [];
    this.middleware = {
        register: ['appAuth']
    };

    return this;
}


/**
 *
 * Returns a list of registered errors.
 *
 * @param params
 * @param done
 * @param req
 * @returns {*}
 */
ErrorsController.prototype.list = function (params, done, req) {
    var that = this;
    var query = this.db.error.makeGenericQuery(params, {
        order: [['last_occurrence', 'DESC']],
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

            return that.db.error.findAndCountAll(query)
                .then(function (errors) {
                    done(errors);
                });
        });

};


/**
 *
 * Registers an incoming error.
 *
 * @param params
 * @param done
 * @param req
 */
ErrorsController.prototype.register = function (params, done, req) {
    if (params.message) {
        done({ok: true});
        this.observr.processError(req.project, params.message, params.stack, params.data);
    } else {
        done({ok: false}, 400);
    }
};


/**
 *
 * Returns a single error instance.
 *
 * @param params
 * @param done
 * @param req
 * @returns {*}
 */
ErrorsController.prototype.get = function (params, done, req) {
    var that = this;
    return req.user.getProjects({raw: true})
        .then(function (projects) {
            var allowedProjects = [];
            projects.forEach(function (project) {
                allowedProjects.push(project.id);
            });

            return that.db.error.findOne({
                where: {id: params.id},
                include: [
                    {
                        model: that.db.errorEvent,
                        as: 'errorEvents',
                        required: false,
                        order: [['created_at', 'DESC']]
                    }
                ]
            }).then(function (error) {
                if (allowedProjects.indexOf(error.projectId)) {
                    done({message: 'access denied'}, 403);
                    return;
                }
                done(error);
            });
        });
};


/**
 *
 * Marks an error as solved.
 *
 * @param params
 * @param done
 * @param req
 */
ErrorsController.prototype.solve = function (params, done, req) {
    var that = this;
    req.user.getProjects({raw: true})
        .then(function (projects) {
            var allowedProjects = [];
            projects.forEach(function (project) {
                allowedProjects.push(project.id);
            });

            return that.db.error.findOne({
                where: {id: params.pid}
            }).then(function (error) {
                if (allowedProjects.indexOf(error.projectId)) {
                    done({message: 'access denied'}, 403);
                    return false;
                } else {
                    error.resolved = true;
                    return error.save();
                }
            }).then(function (error) {
                if (error) {
                    done(error);
                }
            });
        });
};


module.exports = ErrorsController;