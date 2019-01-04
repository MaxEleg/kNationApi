'use strict';
const config = require('../../../config');
const nodemailer = require('nodemailer');

/***
 *
 * @param params => {to: [], subject: '', body.text :'', body.html: ''}
 * @private
 */


async function _send(transporter, params) {

  if(!params.to || !params.body || (!params.body.text && !params.body.html )){
    throw new Error('missing params MailService');
  }

  let message = {
    to: '<' + params.to + '>',
    subject: params.subject,
    text: params.body.text,
    html: params.body.html,
  };

  return await transporter.sendMail(message);
}


/**
 *
 * @param params = {
  to: '',
  subject: '',
  body: {
    text: '',
    html: '<b></b>',
  },
};
 * @returns {Promise<{success: Array, errors: Array}>}
 * @private
 */
async function _sendMail(params) {
  const defaultParams ={
    subject: 'Contact GoToMasdjid',
    body:{text: '', html: ''}
  };
  const results = {success: [], errors:[]};
  let to = [];
  if(!params.body || !(params.body.text || params.body.html )){
    throw new Error('missing params MailService, check body');
  }
  params = Object.assign(defaultParams, params);

  let transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: true,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.password
      },
      logger: false,
      debug: false
    }, {from: 'GoToMasdjid <contact@gotomasdjid.com>',}
  );

  if(!Array.isArray(params.to)){
    to.push(params.to);
  }else{
    to = params.to;
  }

  for(let dest of to){
    try{
      let message = params;
      message.to = dest;

      results.success.push(await _send(transporter, message));
    } catch(ex){
      results.errors.push(ex);
    }
  }
  transporter.close();
  return results;
}

module.exports = {
  sendMail: _sendMail,
};
