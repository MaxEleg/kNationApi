'use strict';

module.exports = function(app) {
  app.get('/v1/config', (req, res)=>{
    let version = 2;
    let urls = {
      ios: 'https://itunes.apple.com/fr/app/gotomasdjid/id1315834640?mt=8',
      android: 'https://play.google.com/store/apps/details?id=app.gtm.gotomasdjid&hl=fr'
    };
    res.json({
      version,
      urls
    });
  });
};
