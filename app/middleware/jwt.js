// @ts-nocheck
'use strict';

const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

module.exports = (options, app) => {
  return async function verifiyToken(ctx, next) {
    // 获取header中的Token
    const token = ctx.header.token;
    if (token) {
      // token解密
      const res = getToken(token);
      if (res.username) {
        // redis -token 对比
        const redisToken = await app.redis.hget('userToken', res.username);
        if (redisToken === token) {
          ctx.locals.username = res.username;
          await next();
        } else {
          ctx.body = { code: 30003, msg: '登陆状态已过期', res };
        }
      } else {
        ctx.body = { code: 30003, msg: '登陆状态已过期', res };
      }
    } else {
      ctx.body = { code: 30001, msg: '缺少token' };
    }
  };
};

function getToken(token) {
  const cert = fs.readFileSync(
    path.join(__dirname, '../public/rsa_public_key.pem')
  ); // 公钥，看后面生成方法
  let res = '';
  try {
    const result = jwt.verify(token, cert, { algorithms: [ 'RS256' ] }) || {};
    const { exp } = result,
      current = Math.floor(Date.now() / 1000);
    console.log(result, 8888);
    if (current <= exp) res = result.data || {};
  } catch (e) {
    console.log(e);
  }
  return res;
}
