// send email
function sendEmail(params) {
  MailApp.sendEmail(params.recipients, params.subject, params.body);
}
