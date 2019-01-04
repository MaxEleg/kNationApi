/* eslint-disable camelcase */
'use strict';
const updateToken = require('../../controllers/middlewares/updateToken');
const GeoPoint = require('loopback').GeoPoint;

module.exports =  function(app) {
  const Partner = app.models.Partner;

  app.get('/v1/partners/', async function(req, res, next) {
    try {
      let location = req.query.location;
      let query = {location: {exists: false}};
      let results = await Partner.find({where: query});

      if (location) {
        let pos = new GeoPoint({
          lat: location.split(',')[0],
          lng: location.split(',')[1],
        });
        query = {
          location: {near: pos, maxDistance: '5000', unit: 'meters'}
        };
        results = [
          ...results,
          ...await Partner.find({where: query})
        ];
      }
      res.json(results);
      next();
    } catch (ex) {
      console.error(ex);
      res.status(400).json({msg: 'An error occured'});
      next();
    }
  });

  app.get('/v1/partners/', updateToken(app));

  app.get('/v1/partners/:id', function(req, res) {
    const id = req.params.id;
    Partner.findById(id,
      function(err, place) {
        if (err) {
          console.log(err);
          res.status(400).json({
            'success': false,
            'msg': 'Une erreur est survenue.'
          });
        } else {
          res.status(200).json(place);
        }
      });
  });
};
