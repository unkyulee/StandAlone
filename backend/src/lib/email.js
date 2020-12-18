// send email
function sendEmail(params) {
  if(params.data) {
    // templating subject
    let subject = HtmlService.createTemplate(params.subject);
    subject.data = params.data;        
    params.subject = subject.evaluate().getContent();

    // template body
    let body = HtmlService.createTemplate(params.body);
    body.data = params.data;
    params.body = body.evaluate().getContent();
  }
  MailApp.sendEmail(params.recipients, params.subject, params.body);
}
