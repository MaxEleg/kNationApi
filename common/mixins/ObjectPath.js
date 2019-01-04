'use strict';

function setValue(object, path, value) {
  let a = path.split('.');
  let o = object;
  for (let i = 0; i < a.length - 1; i++) {
    let n = a[i];
    if (n in o) {
      o = o[n];
    } else {
      o[n] = {};
      o = o[n];
    }
  }
  o[a[a.length - 1]] = value;
}

function getValue(object, path) {
  let o = object;
  path = path.replace(/\[(\w+)\]/g, '.$1');
  path = path.replace(/^\./, '');
  let a = path.split('.');
  while (a.length) {
    let n = a.shift();
    if (n in o) {
      o = o[n];
    } else {
      return;
    }
  }
  return o;
}

module.exports = function(Model, options) {
  Model.prototype.get = function(path) {
    return getValue(this, path);
  };
  Model.prototype.set = function(path, value) {
    return setValue(this, path, value);
  };
};
