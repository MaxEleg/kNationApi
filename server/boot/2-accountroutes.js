var logged = require('../../controllers/middlewares/logged');

function _formatWebAuth(user, token, isAuth = true) {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    artistName: user.artistName,
    rank: user.rank,
    token: token.id,
    userId: user.id,
    isAuth: isAuth
  };
}

module.exports = function publicApi(app) {
  app.post('/account/register', async function(req, res) {
    try {
      var data = req.body;

      if (data.password !== data.confirmPassword) {
        res.status(400).json({error: {msg: 'Mot de passe de confirmation inccorect'}});
        return;
      }

      var User = app.models.User;
      var newUser = new User(req.body);
      await newUser.save();

      var login = await app.models.User.login({
        username: req.body.username,
        password: req.body.password,
      }, 'user');

      var user = await login.user.get();

      if (user.banned) {
        res.status(400).json({msg: "Vous etes banni, l'authentification à la plateforme est refusée"});
        return;
      }

      res.json(_formatWebAuth(user, login));
    } catch (ex) {
      res.status(400).json(ex);
    }
  }

  )
  ;
  app.post('/account/auth', async function(req, res) {
    try {
      var login = await app.models.User.login({
        username: req.body.username,
        password: req.body.password,
      }, 'user');

      var user = await login.user.get();
      if (user.banned) {
        res.status(400).json({msg: "Vous etes banni, l'authentification à la plateforme est refusée"});
        return;
      }

      res.json(_formatWebAuth(user, login));
    } catch (ex) {
      console.log(ex);
      res.status(400).json(ex);
    }
  });

  app.get('/account/logout', function(req, res) {
    var token = req.query.token;
    if (!token) {
      return res.status(400).json({msg: 'Aucun token fourni'});
    }
    app.models.User.logout(token, function(err) {
      if (err) return res.json({msg: 'Une erreur est survenue'});
      res.json({
        msg: 'Vous etes déconnecté',
      });
    });
  });

  app.get('/account/token/reload', logged(app), async function(req, res) {
    try {
      var token = await app.models.AccessToken.create({userId: req.user.id});

      if (!token) {
        res.status(400).json({msg: 'Token non créé'});
        return;
      }

      await app.models.AccessToken.remove({id: req.token.id});
      var user = req.user;

      res.json(_formatWebAuth(user, token));
    } catch (ex) {
      console.log(ex);
      res.status(400).json({msg: 'Une erreur est survenue'});
    }
  });

  app.get('/account/', logged(app), async function(req, res) {
    try {
      var user = req.user;
      var token = await app.models.AccessToken.findOne({id: req.token.id});
      res.json(_formatWebAuth(user, token));
    } catch (ex) {
      console.log(ex);
      res.status(400).json({msg: 'Une erreur est survenue'});
    }
  });
  app.post('/account/edit', logged(app), async function(req, res) {
    try {
      var user = req.user;
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.artistName = req.body.artistName;
      user.phone = req.body.phone;
      user = await user.save();

      await app.models.AccessToken.remove({id: req.token.id});
      var token = await app.models.AccessToken.create({userId: req.user.id});

      res.json(_formatWebAuth(user, token));
    } catch (ex) {
      console.log(ex);
      res.status(400).json({msg: 'Une erreur est survenue'});
    }
  });
};
