'use strict';

module.exports = function(app) {
  const User = app.models.User;
  User.defineProperty('email', {type: 'string', required: 'Cette adresse email est déjà associé à un compte'});
  User.defineProperty('nickname', {type: 'string', required: 'Ce pseudo est déjà pris'});
  User.defineProperty('displayedNickname', {type: 'string', required: false});
  User.defineProperty('username', {type: 'string', required: 'Ce nom de compte est déjà pris'});
  User.defineProperty('firstName', {type: 'string'});
  User.defineProperty('lastName', {type: 'string'});
  User.defineProperty('phone', {type: 'string', required: false});
  User.defineProperty('birthDate', {type: 'date', required: false});
  User.defineProperty('rank', {type: 'number', required: false, default: 0});
  User.defineProperty('banned', {type: 'boolean', required: false, default: false});

  User.validatesUniquenessOf('email', {message: 'Ce mail est déjà pris'});
  User.validatesUniquenessOf('nickname', {message: 'Ce pseudonyme est déjà pris'});
  User.validatesUniquenessOf('username', {message: 'Ce nom de compte est déjà pris'});
};
