var bcrypt = require('bcrypt');

function UsersController(_app) {
    this.app = _app;
    this.db = this.app.db;
    this.name = 'users';
    this.exposed = '*';
    this.public = [];

    return this;
}

UsersController.prototype.list = function (params, done) {
    var query = this.db.user.makeGenericQuery(params, this.db.user);
    return this.db.user.findAndCountAll({attributes: {exclude: ['password']}}, query)
        .then(function (result) {
            done(result);
        });
};

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

UsersController.prototype.new = function (params, done) {
    if (params.password) {
        params.password = bcrypt.hashSync(params.password, 10);
    }
    return this.db.user.create(params)
        .then(function (user) {
            user = user.get();
            delete user.password;
            done(user);
        })
};

UsersController.prototype.update = function (params, done) {
    var that = this;
    var user;
    if (params.password) {
        params.password = bcrypt.hashSync(params.password, 10);
    }
    return that.db.sequelize.transaction({
        deferrable: that.db.Sequelize.Deferrable.SET_DEFERRED,
        logging: console.log
    }, function (t) {
        return that.db.user.findOne({where: {id: params.id}, attributes: {exclude: 'password'}, transaction: t})
            .then(function (_user) {
                user = _user;
                user.set(params);
                return user.save({transaction: t})
            }).then(function (_user) {
                done(_user);
            })
    });
};

UsersController.prototype.delete = function (params, done) {
    return this.db.user.destroy({where: {id: params.id}})
        .then(function (user) {
            done(user);
        })
};

module.exports = UsersController;