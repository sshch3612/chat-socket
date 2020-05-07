// @ts-nocheck
'use strict';

module.exports = appInfo => {
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1547717667493_644';

  // add your config here
  config.middleware = [ 'jwt' ];
  config.jwt = {
    enable: true,
    ignore: [ '/login', '/registered' ], // 哪些请求不需要认证
  };
  config.security = {
    csrf: {
      enable: false,
    },
  };
  config.mongoose = {
    client: {
      url: 'mongodb://test:test@127.0.0.1:27017/test',
      options: {},
    },
  };
  config.io = {
    namespace: {
      '/': {
        connectionMiddleware: [ 'connection', 'packet' ],
        // packetMiddleware: ['connection'],
      },
    },
  };
  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: '11111111',
      db: 0,
    },
  };
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };
  // config.jwt = {
  //   secret: "123456" //自己设置的值
  // };
  return config;
};
