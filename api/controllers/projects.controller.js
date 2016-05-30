var _ = require('lodash');
var md5 = require('md5');
var latinize = require('latinize');
var sequelize = require('sequelize');

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
    var query = this.db.project.makeGenericQuery(params, {attributes: {exclude: ['apiKey']}});

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

    query.include.push({
        model: that.db.error,
        as: 'errors',
        where: {resolved: false},
        attributes: [

        ],
        required: false
    });
    // query.include.push({
    //     model: that.db.error,
    //     as: 'errors',
    //     where: {resolved: false},
    //     attributes: ['id'],
    //     required: false
    // });
    // query.include.push({
    //     model: that.db.error,
    //     as: 'errors',
    //     where: {resolved: false},
    //     attributes: ['id'],
    //     required: false
    // });


    return this.db.project.findAndCountAll(query)
        .then(function (result) {
            done(result);
        });
};

/**
 *
 * Returns a single project instance.
 *
 * @param params
 * @param done
 * @returns Promise
 */
ProjectsController.prototype.get = function (params, done) {
    var that = this;
    return this.db.project.findOne({
        where: {id: params.id},
        include: [
            {
                model: that.db.user,
                as: 'members',
                attributes: ['id', 'firstName', 'lastName']
            }
        ]
    }).then(function (project) {
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
        done(project);
    });
};

/**
 *
 * Creates a new project instance
 *
 * @param params
 * @param done
 * @returns Promise
 */
ProjectsController.prototype.new = function (params, done) {
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
            })
    });
};

/**
 *
 * Updates an existing project instance.
 *
 * @param params
 * @param done
 * @returns Promise
 */
ProjectsController.prototype.update = function (params, done) {
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
            })
    });
};

/**
 *
 * Marks a project instance as deleted.
 *
 * @param params
 * @param done
 * @returns Promise
 */
ProjectsController.prototype.delete = function (params, done) {
    return this.db.project.destroy({where: {id: params.id}})
        .then(function (project) {
            done(project);
        })
};

module.exports = ProjectsController;