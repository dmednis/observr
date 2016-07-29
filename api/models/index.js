'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var _ = require('lodash');
var basename = path.basename(module.filename);
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.js');
var dbConfig = config[env];
var helpers = require('../services/helpers.js');
var db = {};
//Workaround for sequelize error
var pg = require('pg');
delete pg.native;


if (config.use_env_variable) {
    var sequelize = new Sequelize(process.env[dbConfig.use_env_variable]);
} else {
    var sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, _.merge(dbConfig, {
        timezone: 'Europe/Riga',
        logging: config.debug ? console.log : false,
        dialectOptions: {
            charset: 'utf8',
            collation: 'utf8_general_ci'
        },
        define: helpers
    }));
}

fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(function (file) {
        var model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function (modelName) {
    db[modelName].describe()
        .then(function (description) {
            db[modelName].described = description;
        });

    if (db[modelName].associate) {
        db[modelName].associate(db);
    }


});

//sequelize.sync();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
