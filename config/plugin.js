'use strict';

// had enabled by egg
// exports.static = true;
exports.mongoose = {
  enabled: true,
  package: 'egg-mongoose',
};

exports.io = {
  enabled: true,
  package: 'egg-socket.io',
};

exports.redis = {
  enabled: true,
  package: 'egg-redis',
};

// exports.jwt = {//token
//   enable: true,
//   package: "egg-jwt"
// };
exports.cors = {
  enable: true,
  package: 'egg-cors',
};
