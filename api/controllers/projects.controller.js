var _ = require('lodash');
var md5 = require('md5');
var latinize = require('latinize');
var Promise = require('bluebird');

/**
 *
 * ProjectsController. Responsible for project REST API endpoints.
 *
 * @param _app
 * @returns {ProjectsController}
 * @constructor
 */
function ProjectsController(_app) {
    this.app = _app;
    this.db = this.app.db;
    this.logger = this.app.services.logger;
    this.name = 'projects';
    this.exposed = '*';
    this.public = [];

    return this;
}

/**
 *
 * Returns list of projects.
 *
 * @param params
 * @param done
 * @param req
 * @returns Promise
 */
ProjectsController.prototype.list = function (params, done, req) {
    var that = this;
    var query = this.db.project.makeGenericQuery(params, {
        attributes: {
            exclude: ['apiKey']
        }
    });

    if (!(req.user.role == 'admin' && params.admin)) {
        query.include = [
            {
                model: that.db.user,
                as: 'members',
                where: {id: req.user.id},
                attributes: ['id']
            }
        ];
    } else {
        query.include = [];
    }

    var projects;
    return this.db.project.findAndCountAll(query)
        .then(function (_projects) {
            var promises = [];
            var ids = [];
            projects = _projects;

            for (var p = 0; p < projects.rows.length; p++) {
                var project = projects.rows[p].get();
                projects.rows[p] = project;
                ids.push(project.id);
            }

            promises.push(that.db.sequelize.query(
                "SELECT project_id, COUNT(*) FROM errors " +
                "GROUP BY project_id, resolved " +
                "HAVING resolved != TRUE;",
                {type: that.db.sequelize.QueryTypes.SELECT})
            );

            promises.push(that.db.sequelize.query(
                "SELECT project_id, COUNT(*) FROM events " +
                "WHERE created_at >= NOW() - '1 day'::INTERVAL " +
                "GROUP BY project_id;",
                {type: that.db.sequelize.QueryTypes.SELECT})
            );

            //TODO: get log count
            
            return Promise.all(promises);

        }).then(function (results) {
            var errorCount = _.keyBy(results[0], 'project_id');
            var eventCount = _.keyBy(results[1], 'project_id');

            projects.rows.forEach(function (project) {
                project.errors = errorCount[project.id] ? errorCount[project.id].count : 0;
                project.events = eventCount[project.id] ? eventCount[project.id].count : 0;
                project.logs = 0;
            });

            done(projects);
        });
};

/**
 *
 * Returns a single project instance.
 *
 * @param params
 * @param done
 * @param req
 * @returns Promise
 */
ProjectsController.prototype.get = function (params, done, req) {
    var that = this;
    var query = {
        where: {id: params.id}
    };

    if (!(req.user.role == 'admin' && params.admin)) {
        query.include = [
            {
                model: that.db.user,
                as: 'members',
                where: {id: req.user.id},
                attributes: ['id', 'firstName', 'lastName']
            }
        ];
    } else {
        query.include = [];
    }

    return this.db.project.findOne(query).then(function (project) {
        if (project) {
            project = project.get();
            var members = {};
            project.members.forEach(function (member) {
                members[member.id] = {
                    id: member.id,
                    role: member.projectUsers.role,
                    name: member.firstName + ' ' + member.lastName
                };
            });
            project.members = members;
        }
        done(project);
    });
};

/**
 *
 * Creates a new project instance
 *
 * @param params
 * @param done
 * @param req
 * @returns Promise
 */
ProjectsController.prototype.new = function (params, done, req) {
    var that = this;
    var project = params;
    project.apiKey = md5(Date.UTC + project.name);
    project.identifier = _.kebabCase(latinize(project.name));
    return that.db.sequelize.transaction({
        deferrable: that.db.Sequelize.Deferrable.SET_DEFERRED,
        logging: console.log
    }, function (t) {
        return that.db.project.create(params)
            .then(function (_project) {
                project = _project;
                var userIds = [];
                _.forOwn(params.members, function (val, key) {
                    userIds.push(val.id)
                });
                return that.db.user.findAll({where: {id: {$in: userIds}}});
            }).then(function (users) {
                users.forEach(function (user) {
                    user.projectUsers = {role: params.members[user.id].role};
                });
                return project.setMembers(users, {transaction: t});
            }).then(function () {
                project = project.get();
                project.members = params.members;
                done(project);
                that.logger.log('project:create', {projectId: project.id, userId: req.user.id});
            })
    });
};

/**
 *
 * Updates an existing project instance.
 *
 * @param params
 * @param done
 * @param req
 * @returns Promise
 */
ProjectsController.prototype.update = function (params, done, req) {
    var that = this;
    delete params.identifier;
    delete params.apiKey;
    var project;
    return that.db.sequelize.transaction({
        deferrable: that.db.Sequelize.Deferrable.SET_DEFERRED,
        logging: console.log
    }, function (t) {
        return that.db.project.findOne({where: {id: params.id}, transaction: t})
            .then(function (_project) {
                project = _project;
                project.set(params);
                return project.save({transaction: t})
            }).then(function (_project) {
                project = _project;
                var userIds = [];
                _.forOwn(params.members, function (val, key) {
                    userIds.push(val.id)
                });
                return that.db.user.findAll({where: {id: {$in: userIds}}});
            }).then(function (users) {
                users.forEach(function (user) {
                    user.projectUsers = {role: params.members[user.id].role};
                });
                return project.setMembers(users, {transaction: t});
            }).then(function () {
                project = project.get();
                project.members = params.members;
                done(project);
                that.logger.log('project:update', {projectId: project.id, userId: req.user.id});
            })
    });
};

/**
 *
 * Marks a project instance as deleted.
 *
 * @param params
 * @param done
 * @param req
 * @returns Promise
 */
ProjectsController.prototype.delete = function (params, done, req) {
    var that = this;
    return this.db.project.destroy({where: {id: params.id}})
        .then(function (project) {
            done(project);
            that.logger.log('project:delete', {projectId: params.id, userId: req.user.id});
        })
};

module.exports = ProjectsController;