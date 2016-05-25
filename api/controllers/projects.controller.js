var _ = require('lodash');
var md5 = require('md5');

function ProjectsController(_app) {
    this.app = _app;
    this.db = this.app.db;
    this.name = 'projects';
    this.exposed = '*';
    this.public = [];

    return this;
}

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
    }

    return this.db.project.findAndCountAll(query)
        .then(function (result) {
            done(result);
        });
};

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

ProjectsController.prototype.new = function (params, done) {
    var project = params;
    project.apiKey = md5(Date.UTC + project.name);
    //TODO: latinize identifier
    project.identifier = _.kebabCase(project.name);
    return this.db.project.create(params)
        .then(function (project) {
            project = project.get();
            done(project);
        });
};

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

ProjectsController.prototype.delete = function (params, done) {
    return this.db.project.destroy({where: {id: params.id}})
        .then(function (project) {
            done(project);
        })
};

module.exports = ProjectsController;