'use strict';

module.exports = function(app) {
  const AccessToken = app.models.AccessToken;
  AccessToken.defineProperty('position', {type: 'geopoint', required: false});
  AccessToken.defineProperty('data', {type: 'object', default: {}, required: false});
  AccessToken.defineProperty('updatedAt', {type: 'date', required: false});
};
