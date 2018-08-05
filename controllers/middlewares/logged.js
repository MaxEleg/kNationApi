var util = require('util');

module.exports = function(app) {
  return async function(req, res, next) {
    try{
      var AccessToken = app.models.AccessToken;
      var tokenId = req.query.token || req.body.token || req.headers.token;

      if (!tokenId) {
        res.status(400).json({msg: 'Token non fourni'});
        return;
      }

      var token = await AccessToken.findById(tokenId);

      if(!token){
        res.status(400).json({msg: 'Token inconnu'});
        return;
      }

      var user = await app.models.User.findById(token.userId);
      if(!user){
        res.status(400).json({msg: "Le propriétaire du token est introuvable" });
        return;
      }
      if(user.banned){
        res.status(400).json({msg: 'Vous avez été banni, la plateforme vous est innacessible'});
        return;
      }
      req.user = user;
      req.token = token;
      next();
    }catch(ex){
      console.log(ex);
      res.status(400).json({msg: "Merci de vérifier le token"});
      return;
    }
  };
};
