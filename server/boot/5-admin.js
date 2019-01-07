'use strict';

let logged = require('../../controllers/middlewares/logged');
let admin = require('../../controllers/middlewares/admin');
const GeoPoint = require('loopback').GeoPoint;

module.exports = function(app) {
  const User = app.models.User;

  app.use('/admin/*', logged(app));
  app.use('/admin/*', admin(app));

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
    let nbUsers = await User.count({});

    res.json(({
      nbUsers
    }));
  });
};
