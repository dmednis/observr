var _ = require('lodash');

/**
 *
 * Notifier. Wrapper for Mailer.
 *
 * @param app
 * @constructor
 */
function Notifier(app) {
    this.app = app;
    this.mailer = app.services.mailer;
    var that = this;


    this.notifyError = this.notifyError.bind(this);
}


/**
 *
 * Sends error notification email.
 *
 * @param data
 * @param params
 */
Notifier.prototype.notifyError = function (data, params) {
    var body = '<div style="font-family:Helvetica,Arial,sans-serif;">';

    body += '<h1>Observr has caught an error!</h1>';
    body += '<p>';
    body += 'Project: ' + data.project.name + '</br>';
    body += 'Error: ' + data.error.message + '</br></br>';
    body += data.error.stack + '</br></br>';
    body += '</p>';
    body += '<p>';
    body += 'This is an automated message!';
    body += '</p>';
    body += '</div>';

    var recipients = [];

    if (params && params.recipients) {
        for (var r = 0; r < params.recipients.length; r++) {
            recipients.push(params.recipients[r]);
        }
    }
    console.log(recipients);
    this.mailer.sendMail(
        recipients,
        "Observr - error",
        body,
        "Error notification"
    );
};


module.exports = Notifier;