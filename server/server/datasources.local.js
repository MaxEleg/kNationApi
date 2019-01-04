'use strict';

const config = require('../config');
let url =  'mongodb://';

if (config.mongodb.user && config.mongodb.user.length > 0) {
  url +=  config.mongodb.user + ':' + config.mongodb.password + '@';
}
url += config.mongodb.host;
url += ':' + config.mongodb.port;
url += '/' + config.mongodb.database;

let mongodb = {
  host: config.mongodb.host,
  port: config.mongodb.port,
  url: url,
  database: config.mongodb.database,
  password: config.mongodb.password,
  name: 'mongodb',
  user: config.mongodb.user,
  connector: 'mongodb',
};

module.exports = {
  db: {
    name: 'db',
    connector: 'memory',
  },
  mongodb: mongodb,
};
