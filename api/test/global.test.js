process.env.NODE_ENV = 'test';

var assert = require("assert");
var request = require('supertest');
var app = require("../app.js");


describe('Data models', function () {
    Object.keys(app.db).forEach(function (model) {
        {
            if (model !== 'sequelize' && model !== 'Sequelize') {
                it(model + ' works', function (done) {
                    app.db[model].findAll({limit: 1}).then(function () {
                        done();
                    }, function (err) {
                        done(err);
                    });
                });
            }
        }
    });
});

// describe('API', function () {
//     it('API works', function (done) {
//         request(app)
//             .get('/')
//             .expect(200, done);
//     });
//     for (var r = 0; r < app.routes.length; r++) {
//         var route = app.routes[r];
//         it('API endpoint ' + route.url + ' works', function (done) {
//             if (route.auth) {
//                 request(app)[route.method](route.url)
//                     .expect(401, done);
//             } else {
//                 request(app)[route.method](route.url)
//                     .expect(function (res) {
//                         if (res.statusCode == 200 || res.statusCode == 400) {
//                             return false;
//                         } else {
//                             return true;
//                         }
//                     })
//                     .end(done)
//             }
//         })
//     }
// });