"use strict";
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

module.exports = {
  generateToken(data, expires = 7200) {
    const exp = Math.floor(Date.now() / 1000) + expires;
    const cert = fs.readFileSync(
      path.join(__dirname, "../public/rsa_private_key.pem")
    ); // 私钥，看后面生成方法
    const token = jwt.sign({ data, exp }, cert, { algorithm: "RS256" });
    return token;
  }
};
