'use strict';

const logged = require('../../controllers/middlewares/logged');
const ApiToken = require('../../controllers/lib/api/token');

module.exports = function publicApi(app) {
  const User = app.models.User;
  const AccessToken = app.models.AccessToken;
  app.post('/v1/account/register', async function(req, res) {
    try {
      let data = req.body;
      data.username = data.username ? data.username.toLowerCase().trim() : null;
      data.email = data.email ? data.email.toLowerCase().trim() : null;
      data.displayedNickname = data.nickname.toString();
      data.nickname = data.nickname ? data.nickname.toLowerCase().trim() : null;
      if (data.birthDate) {
        data.birthDate = new Date(parseInt(data.birthDate));
      }
      if (data.password !== data.confirmPassword) {
        res.status(400).json({error: {msg: 'Mot de passe de confirmation inccorect'}});
        return;
      }
      delete data.confirmPassword;
      let newUser = new User(data);
      await newUser.save();

      let login = await User.login({
        username: data.username,
        password: data.password,
      }, 'user');

      let user = await login.user.get();

      if (user.banned) {
        res.status(400).json({msg: "Vous etes banni, l'authentification à la plateforme est refusée"});
        return;
      }
      res.json(ApiToken.formatWebAuth(user, login));
    } catch (ex) {
      console.error(ex);
      res.status(400).json(ex);
    }
  });
  app.post('/v1/account/auth', async function(req, res) {
    try {
      let tokenId = req.query.token || req.body.token || req.headers.token;
      let username = req.body.username;
      let email = req.body.email;
      let oldToken;

      let login = await User.login({
        username: username ? username.toLowerCase() : null,
        email: email ? email.toLowerCase() : null,
        password: req.body.password
      });

      let user = await login.user.get();
      if (user.banned) {
        res.status(400).json({msg: "Vous etes banni, l'authentification à la plateforme est refusée"});
        await login.destroy();
        return;
      }

      if (tokenId && (oldToken = await AccessToken.findById(tokenId))) {
        login.data = oldToken.data;
        login.position = oldToken.position;
        await oldToken.destroy();
        login = await login.save();
      }

      res.json(ApiToken.formatWebAuth(user, login));
    } catch (ex) {
      console.error(ex);
      res.status(400).json(ex);
    }
  });
  app.get('/v1/account/logout', async function(req, res) {
    let tokenId = req.query.token || req.body.token || req.headers.token;
    await AccessToken.removeById(tokenId);
    res.json({
      msg: 'Vous etes déconnecté',
    });
  });
  app.get('/v1/account/', logged(app), async function(req, res) {
    try {
      let user = req.user;
      let token = await AccessToken.findOne({id: req.token.id});
      res.json(ApiToken.formatWebAuth(user, token));
    } catch (ex) {
      console.log(ex);
      res.status(400).json({msg: 'Une erreur est survenue'});
    }
  });
  app.post('/v1/account/edit', logged(app), async function(req, res) {
    try {
      let user = req.user;
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user = await user.save();
      res.json(ApiToken.formatWebAuth(user, req.token));
    } catch (ex) {
      console.log(ex);
      res.status(400).json({msg: 'Une erreur est survenue'});
    }
  });
  app.get('/v1/account/check', async function(req, res) {
    let username = req.query.username || req.body.username || req.headers.username;
    let email = req.query.email || req.body.email || req.headers.email;
    let nickname = req.query.nickname || req.body.nickname || req.headers.nickname;

    let query = username ? {username: username.toLowerCase().trim()} : {};
    query = email ? {email: email.toLowerCase().trim()} : query;
    query = nickname ? {nickname: nickname.toLowerCase().trim()} : query;

    try {
      let user = await User.findOne({where: query});
      if (user) {
        res.json({exists: true});
        return;
      }
      res.json({exists: false});
    } catch (ex) {
      res.status(400).json({});
    }
  });
};
