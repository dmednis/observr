module.exports = {
//SEQUELIZE CONFIG
    development: {
        username: "postgres",
        password: "qwerty1234",
        database: "bugmetrics",
        host: "127.0.0.1",
        dialect: "postgres"
    },
    test: {
        username: "postgres",
        password: "qwerty1234",
        database: "bugmetrics",
        host: "127.0.0.1",
        dialect: "postgres"
    },
    production: {
        username: "postgres",
        password: "qwerty1234",
        database: "bugmetrics",
        host: "127.0.0.1",
        dialect: "postgres"
    },
//APP CONFIG
    debug: false,
    port: 4100,
    secret: '',
    // smtp : {
    //     host: 'smtp.sparkpostmail.com',
    //     port: 587 ,
    //     auth: {
    //         user: '',
    //         pass: ''
    //     },
    //     sender: 'mail@sparkpostbox.com'
    // },
    // test_email: '',
    // ldap: {
    //     url: '',
    //     baseDN: '',
    //     username: '',
    //     password: '',
    //     domain: ''
    // }
};
