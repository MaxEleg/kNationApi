'use strict';
const config = require('../../config');
const request = require('request');

module.exports =  function(app) {
  app.get('/v1/position', function(req, res) {
    try {
      let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      ip = ip.split(':');
      ip = ip[ip.length - 1];
      if (ip.length < 7) {
        res.status(400).json({msg: 'False IP : ' + ip});
        return;
      }
      let url = 'http://api.ipstack.com/' + ip + '?access_key=' + config.ipStack.key;
      request(url, function(err, response, body) {
        body = JSON.parse(body);
        body.ip = ip;
        body.pos = {
          latitude: body.latitude,
          longitude: body.longitude,
        };
        res.json(body);
      });
    } catch (ex) {
      console.log(ex);
      res.status(400).json({msg: 'an error occured'});
    }
  });
};
