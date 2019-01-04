'use strict';

let logged = require('../../controllers/middlewares/logged');
let admin = require('../../controllers/middlewares/admin');
const GeoPoint = require('loopback').GeoPoint;

module.exports = function(app) {
  const Place = app.models.Place;
  const User = app.models.User;
  const Partner = app.models.Partner;

  app.use('/admin/*', logged(app));
  app.use('/admin/*', admin(app));

  /** **** PLACES ******/
  app.get('/admin/places', function(req, res) {
    let search = {};

    if (req.query.search) {
      search = req.query.search;
      search = JSON.parse(search);
    }
    Place.find(search,
      function(err, places) {
        if (err) {
          console.log(err);
        } else {
          res.json({
            places
          });
        }
      });
  });

  app.get('/admin/place/:id', function(req, res) {
    Place.findById(req.params.id, function(err, place) {
      if (err) {
        console.log(err);
        res.json({
          'success': false,
          'err': err
        });
      } else {
        res.json({
          'success': true,
          place
        });
      }
    });
  });

  app.delete('/admin/place/:id', function(req, res) {
    Place.removeById(req.params.id, function(err, place) {
      if (err) {
        console.log('Suppression erreur : ' + err);
        res.json(err);
        return;
      }
      console.log('Place suprimée ! ID = ' + req.params.id);
      res.send('Place supprimée ! ID = ' + req.params.id);
    });
  });

  /** **** USERS ******/
  app.get('/admin/users', function(req, res) {
    User.find({},
      function(err, users) {
        if (err) {
          res.json(err);
          return;
        }
        res.json(users);
      });
  });

  app.delete('/admin/user/:id', function(req, res) {
    User.removeById(req.params.id, function(err, user) {
      if (err) {
        console.log(err);
        res.json({
          'success': false,
          'err': err
        });
      } else {
        var msg = 'Le compte de ' + user.firstName;
        msg += ' ' + user.lastName + ' a été supprimé';
        res.json({
          'success': true,
          'msg': msg
        });
      }
    });
  });

  app.get('/admin/user/:id', function(req, res) {
    User.findById(req.params.id, function(err, user) {
      if (err) {
        console.log(err);
        res.json({
          'success': false,
          'err': err
        });
      } else {
        res.json({
          'success': true,
          user
        });
      }
    });
  });

  app.get('/admin/user/ban/:id', function(req, res) {
    User.findById(req.params.id, function(err, user) {
      if (err) {
        console.log(err);
        res.json({
          'success': false,
          'err': err
        });
        return;
      }
      user.banned = req.query.banned;
      user.save((err, result) => {
        if (err) {
          console.log(err);
          res.json({
            'success': false,
            'err': err
          });
        } else {
          res.json({
            success: true,
            msg: "L'utilisateur a bien été banni !"
          });
        }
      });
    });
  });

  app.get('/admin/stats', async function(req, res) {
    let nbMasdjids  = await Place.count({});
    let nbMasdjidsUsers = await Place.count({origin: 'user'});
    let nbPrayerTimes = await Place.count({hasPrayer: true});
    let nbUsers = await User.count({});

    res.json(({
      nbMasdjids,
      nbMasdjidsUsers,
      nbPrayerTimes,
      nbUsers
    }));
  });

  app.post('/admin/partners', async function(req, res) {
    try {
      let data = req.body;
      let newPartner = new Partner(data);
      newPartner = await newPartner.save();
      res.json(newPartner);
    } catch (ex) {
      console.error(ex);
      res.status(400).json({msg: "Une erreur s'est produite"});
    }
  });

  app.put('/v1/partners/:id', async function(req, res) {
    try {
      let data = req.body;
      let partner = await Partner.findById(req.params.id);
      if (!partner) {
        res.status(400).json({msg: 'Partner introuvable'});
        return;
      }
      partner.location = data.location;
      partner.infos = data.infos;
      partner.images = data.images;
      partner.endAt = data.endAt;

      partner = await partner.save();
      res.json(partner);
    } catch (ex) {
      console.error(ex);
      res.status(400).json({msg: "Une erreur s'est produite"});
    }
  });
};
