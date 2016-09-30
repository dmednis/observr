var bcrypt = require('bcrypt');

/**
 *
 * UsersController. Responsilbe for user REST API endpoints.
 *
 * @param _app
 * @returns {UsersController}
 * @constructor
 */
function UsersController(_app) {
    this.app = _app;
    this.db = this.app.db;
    this.logger = this.app.services.logger;
    this.name = 'users';
    this.exposed = '*';
    this.public = [];

    this.middleware = {
        list: ['auth'],
        get: ['auth', 'admin'],
        update: ['auth', 'admin'],
        new: ['auth', 'admin'],
        delete: ['auth', 'admin']
    };

    return this;
}

/**
 *
 * Returns a list of users.
 *
 * @param params
 * @param done
 * @returns {*}
 */
UsersController.prototype.list = function (params, done) {
    var query = this.db.user.makeGenericQuery(params, {attributes: {exclude: ['password']}});

    return this.db.user.findAndCountAll(query)
        .then(function (result) {
            done(result);
        });
};


/**
 *
 * Returns a single user instance.
 *
 * @param params
 * @param done
 * @returns {*}
 */
UsersController.prototype.get = function (params, done) {
    var that = this;
    return this.db.user.findOne({
        attributes: {
            exclude: ['password']
        },
        where: {id: params.id}
    }).then(function (user) {
        done(user);
    });
};


/**
 *
 * Creates new user.
 *
 * @param params
 * @param done
 * @param req
 * @returns {*}
 */
UsersController.prototype.new = function (params, done, req) {
    var that = this;
    if (params.password) {
        params.password = bcrypt.hashSync(params.password, 10);
    }
    return this.db.user.create(params)
        .then(function (user) {
            user = user.get();
            delete user.password;
            done(user);
            that.logger.log('user:create', {projectId: user.id, userId: req.user.id});
        })
};


/**
 *
 * Updates user data.
 *
 * @param params
 * @param done
 * @param req
 * @returns {*}
 */
UsersController.prototype.update = function (params, done, req) {
    var that = this;
    var user;
    if (params.password) {
        params.password = bcrypt.hashSync(params.password, 10);
    }
    return that.db.sequelize.transaction({
        deferrable: that.db.Sequelize.Deferrable.SET_DEFERRED,
        logging: console.log
    }, function (t) {
        return that.db.user.findOne({where: {id: params.id}, transaction: t})
            .then(function (_user) {
                user = _user;
                user.set(params);
                return user.save({transaction: t})
            }).then(function (_user) {
                delete _user.password;
                done(_user);
                that.logger.log('user:update', {projectId: _user.id, userId: req.user.id});
            })
    });
};

/**
 *
 * Sets user as deleted.
 *
 * @param params
 * @param done
 * @param req
 * @returns {*}
 */
UsersController.prototype.delete = function (params, done, req) {
    var that = this;
    return this.db.user.destroy({where: {id: params.id}})
        .then(function (user) {
            done(user);
            that.logger.log('user:delete', {projectId: params.id, userId: req.user.id});
        })
};

module.exports = UsersController;