"use strict";
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const request = require("request");
const Uuid = require("uuid");
const qiniu = require("qiniu");


const accessKey = "bcIae8Et0Lf6kzuU5lFk-vud4TW8s22222233443";
const secretKey = "ms7pwXuCoiJOG6nvQfszZQM3OwMu998833232344";
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
//要上传的空间
const options = {
  scope: "nodechat",
  expires: 7200
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);

module.exports = {
  generateToken(data, expires = 7200) {
    const exp = Math.floor(Date.now() / 1000) + expires;
    const cert = fs.readFileSync(
      path.join(__dirname, "../public/rsa_private_key.pem")
    ); // 私钥，看后面生成方法
    const token = jwt.sign({ data, exp }, cert, { algorithm: "RS256" });
    return token;
  },
  test() {
    console.log("测试一下");
  },
  //图片上传7牛云 base64
  async fileUpload(urlpath, data, filename) {
    const datainfo = data.replace(`${data.split(",")[0]},`, "");
    const baseUrl = "http://pry40zxwo.bkt.clouddn.com/";
    filename = filename || Uuid.v1();
    return new Promise((resolve, reject) => {
      request(
        {
          url: `http://upload-z2.qiniu.com/putb64/-1${urlpath}/${filename}`, //请求路径
          method: "POST", //请求方式，默认为get
          headers: {
            //设置请求头
            "content-type": "application/octet-stream",
            Authorization: `UpToken ${uploadToken}`,
            key: filename
          },
          body: datainfo //JSON.stringify(requestData) //post参数字符串
        },
        function(error, response, body) {
          if (!error && response.statusCode == 200) {
            console.log(filename, body, 999);
            resolve(`${baseUrl}${JSON.parse(body).key}`);
          }
        }
      );
    });
  }
};
