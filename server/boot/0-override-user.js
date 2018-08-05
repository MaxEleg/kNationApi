module.exports = function publicApi(app) {
  var User = app.models.User;
  User.defineProperty('email', {type: 'string', required: 'Ce mail est déjà associé à un compte'});
  User.defineProperty('firstName', {type: 'string', required: 'Merci de rentrer un prénom'});
  User.defineProperty('lastName', {type: 'string', required: 'Merci de rentrer un nom'});
  User.defineProperty('artistName', {type: 'string', default: ""});
  User.defineProperty('phone', {type: 'string', required: false});
  User.defineProperty('birthDate', {type: 'date', required: false});
  User.defineProperty('rank', {type: 'number', required: false, default: 0});
  User.defineProperty('banned', {type: 'boolean', required: false, default: false});
};
