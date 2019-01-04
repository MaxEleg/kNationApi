'use strict';

let prayerTime = require('../../controllers/lib/api/prayerTime');

module.exports = function(app) {
  app.get('/v1/config', (req, res)=>{
    let version = 2;
    let methods = prayerTime.getMethods();
    let urls = {
      ios: 'https://itunes.apple.com/fr/app/gotomasdjid/id1315834640?mt=8',
      android: 'https://play.google.com/store/apps/details?id=app.gtm.gotomasdjid&hl=fr'
    };
    res.json({
      version,
      methods,
      urls
    });
  });
};
