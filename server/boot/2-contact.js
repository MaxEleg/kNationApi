'use strict';
const MailService = require('../../controllers/lib/MailService');
module.exports = function publicApi(app) {
  app.post('/v1/contact', async (req, res)=> {
    try {
      const data = req.body;

      let html = '<center><h3>' + data.subject + '</h3></center>';
      html += '<p><b>Nom prénom : </b> ' + data.lastName + ' ' + data.firstName + '</p>';
      html += '<p><b>Email : </b> ' + data.email + ' </p>';
      html += '<p><b>Message : </b> ' + data.message + '</p>';
      const params = {
        to: ['maximilien.elegbe@outlook.fr'],
        subject: 'Message client : ' + data.subject,
        body: {
          html,
        },
      };

      let results = await MailService.sendMail(params);

      if (results.errors.length) {
        console.error(JSON.stringify(results));
      }

      res.json({send: true});
    } catch (ex) {
      console.error(ex);
      console.error(req.body);
      res.status(400).json({send: false, msg: ex});
    }
  });
};
