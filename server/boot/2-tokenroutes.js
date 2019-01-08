'use strict';

const ApiToken = require('../../controllers/lib/api/token');

module.exports = function publicApi(app) {
  const AccessToken = app.models.AccessToken;

  app.get('/v1/account/token', async function(req, res) {
    try {
      let user = {};
      let tokenId = req.query.token || req.body.token || req.headers.token;
      let oldToken;
      let newToken = new AccessToken();

      if (tokenId && (oldToken = await AccessToken.findById(tokenId))) {
        user = oldToken.userId ? await oldToken.user.get() : {};
        newToken.data = oldToken.data;
        newToken.userId = oldToken.userId;
        newToken.position = oldToken.position;
        await oldToken.destroy();
      }
      newToken = await newToken.save();
      res.json(ApiToken.formatWebAuth(user, newToken));
    } catch (ex) {
      console.log(ex);
      res.status(400).json({msg: 'Une erreur est survenue'});
    }
  });
  app.post('/v1/account/token', async function(req, res) {
    try {
      let tokenId = req.query.token || req.body.token || req.headers.token;
      let data = req.body;

      if (!tokenId) {
        res.status(400).json({msg: 'Token non fourni'});
        return;
      }

      let token = await AccessToken.findById(tokenId);

      if (!token) {
        res.status(400).json({msg: 'Le token est introuvable'});
        return;
      }
      token.data['deviceId'] = data.deviceId;
      token.data['settings'] = data.settings;
      token.updatedAt = new Date();
      token = await token.save();
      res.json(token);
    } catch (ex) {
      console.log(ex);
      res.status(400).json({msg: 'Une erreur est survenue'});
    }
  });
};
