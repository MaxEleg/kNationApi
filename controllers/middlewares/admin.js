module.exports = function(app) {
  return async function(req, res, next) {
    try{

      if(req.user && req.user.rank>=7){
        next();
        return;
      }

      res.status(400).json({ "msg": "Vous n'avez pas les droits d'accéder à cette ressource"});
      return;

    }catch(ex){
      console.log(ex);
      res.status(400).json({msg: "Merci de vérifier le token"});
      return;
    }
  };
};
