'use strict';

module.exports = function(app) {
  const User = app.models.User;
  User.defineProperty('email', {type: 'string', required: 'Ce mail est déjà associé à un compte'});
  User.defineProperty('mail', {type: 'string', required: false, index: {unique: false}});
  User.defineProperty('username', {type: 'string'});
  User.defineProperty('firstName', {type: 'string'});
  User.defineProperty('lastName', {type: 'string'});
  User.defineProperty('phone', {type: 'string', required: false});
  User.defineProperty('icon', {type: 'string', required: false});
  User.defineProperty('birthDate', {type: 'date', required: false});
  User.defineProperty('rank', {type: 'number', required: false, default: 0});
  User.defineProperty('lastPosition', {type: 'GeoPoint', required: false});
  User.defineProperty('banned', {type: 'boolean', required: false, default: false});

  User.validatesUniquenessOf('email', {message: 'Ce mail est déjà pris'});
  User.validatesUniquenessOf('username', {message: 'Ce nom de compte est déjà pris'});
};
