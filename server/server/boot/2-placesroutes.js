/* eslint-disable camelcase */

'use strict';
const config = require('../../config');
const GoogleApi = require('../../controllers/lib/GoogleApi');
const Api = require('../../controllers/lib/api/places');
const GeoPoint = require('loopback').GeoPoint;
const loggedMiddleware = require('../../controllers/middlewares/logged');
const updateToken = require('../../controllers/middlewares/updateToken');

module.exports =  function(app) {
  const Place = app.models.Place;

  app.get('/v1/places/', async function(req, res, next) {
    try {
      let location = req.query.location;
      let radius = req.query.radius;

      let results = await Api.searchNearBy(app, {location, radius});

      if (!req.query.silent) {
        let gPlaces = await GoogleApi.searchPlaces({
          location,
          radius,
        });
        results = [...results, ...(await Api.importFromGoogle(app, gPlaces))];
      }
      res.json(results);
      next();
    } catch (ex) {
      console.error(ex);
      res.status(400).json({msg: 'An error occured'});
      next();
    }
  });

  app.get('/v1/places/', updateToken(app));

  app.get('/place/:id', function(req, res) {
    const id = req.params.id;
    Place.findById(id,
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

  app.post('/v1/place', loggedMiddleware(app), async function(req, res) {
    try {
      let data = req.body;
      let newMasdjid = new Place({
        location: new GeoPoint(data.location),
        type: 'masdjid',
        origin: 'user',
        createdBy: req.user.id,
        name: data.name,
        placeId: data.placeId,
        address: {vicinity: data.address},
      });
      newMasdjid = await newMasdjid.save();
      res.json(newMasdjid);
    } catch (ex) {
      console.error(ex);
      res.status(400).json({msg: "Une erreur s'est produite"});
    }
  });

  app.put('/v1/place/:id', async function(req, res) {
    try {
      let data = req.body;
      let masdjid = await Place.findById(req.params.id);
      if (!masdjid) {
        res.status(400).json({msg: 'Mosquée introuvable'});
        return;
      }
      masdjid.name = data.name;
      masdjid.details = data.details;
      masdjid.address = data.address;
      masdjid.location = data.location;

      masdjid = await masdjid.save();
      res.json(masdjid);
    } catch (ex) {
      console.error(ex);
      res.status(400).json({msg: "Une erreur s'est produite"});
    }
  });
};
