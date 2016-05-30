var nodemailer = require('nodemailer');
var _ = require('lodash');

/**
 *
 * @param app
 * @constructor
 */
function Mailer (app) {
    this.app = app;
    this.queue = app.queue;
    var that = this;
    var config = _.assign({}, app.config.smtp, {pool: true});

    if (app.config.smtp) {
        this.transporter = nodemailer.createTransport(config);
        this.transporter.verify(function (error, success) {
            if (error) {
                console.error('MAILER ERROR', error);
            } else {
                console.log('MAILER READY');
            }
        });


        this.queue.process('email', 20, function (job, done) {
            var mailOptions = {
                from: {
                    name: 'Observr',
                    address: app.config.smtp.sender || 'mail@observr.com'
                },
                to: job.data.to,
                subject: job.data.subject,
                text: job.data.body,
                html: job.data.body
            };

            that.transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    done(error);
                    return;
                }
                console.log('Message sent: ' + info.response);
                done();
            });
        });
        this.sendMail = this.sendMail.bind(this);
        this.filterOutgoing = this.filterOutgoing.bind(this);
    } else {
        console.log("MAILER ERROR: NO CONFIG");
        this.sendMail = function () {
            console.log("MAILER ERROR: NO CONFIG");
            return false;
        };
        this.filterOutgoing = function () {
            return false;
        };
    }

}

/**
 *
 * @param to
 * @param subject
 * @param message
 * @param jobTitle
 */
Mailer.prototype.sendMail = function (to, subject, message, jobTitle) {
    
    var recipients = [];
    if (typeof to === 'object' && Array.isArray(to)) {
        recipients = to;
    } else if (typeof to === 'string') {
        recipients.push(to);
    }

    recipients = this.filterOutgoing(recipients);

    for (var r = 0; r < recipients.length; r++) {
        var job = this.queue.create('email', {
            title: jobTitle || "Email notification",
            to: recipients[r],
            subject: subject,
            body: message
        }).attempts(3).save(function (err) {
            if (!err) {
                console.log(job.id);
            }
        });
        job.on('complete', function (result) {
            console.log('Job completed with data ', result, ' - Email notification');
        }).on('failed attempt', function (errorMessage, doneAttempts) {
            console.log('Job failed - Email notification', errorMessage, doneAttempts);
        }).on('failed', function (errorMessage) {
            console.log('Job failed - Email notification', errorMessage);
        });
    }

};


/**
 *
 * @param recipients
 * @returns Array
 */
Mailer.prototype.filterOutgoing = function (recipients) {
    var filtered = recipients;

    switch (this.app.environment) {
        case "production":

            break;
        case "development":

            break;
        case "test":
            filtered = [];
            break;
        case "local":
            if (this.app.config.test_email) {
                filtered = [this.app.config.test_email]
            } else {
                filtered = [];
            }
            break;
        default:
            filtered = [];
            break;
    }

    return filtered;
};

module.exports = Mailer;