var _ = require('lodash');

function ProjectsController(_app) {
    this.app = _app;
    this.db = this.app.db;
    this.name = 'projects';
    this.exposed = '*';
    this.public = [];

    return this;
}

ProjectsController.prototype.list = function (params, done) {
    var query = this.db.project.makeGenericQuery(params, {attributes: {exclude: ['apiKey']}});
    
    return this.db.project.findAndCountAll(query)
        .then(function (result) {
            done(result);
        });
};

ProjectsController.prototype.get = function (params, done) {
    var that = this;
    return this.db.project.findOne({
        where: {id: params.id}
    }).then(function (project) {
        done(project);
    });
};

ProjectsController.prototype.new = function (params, done) {
    var project = params;
    project.apiKey = "";
    project.identifier = _.kebabCase(project.name);
    return this.db.project.create(params)
        .then(function (project) {
            project = project.get();
            done(project);
        });
};

ProjectsController.prototype.update = function (params, done) {
    var that = this;
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
                done(_project);
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