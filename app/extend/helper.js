"use strict";
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const request = require("request");
const Uuid = require("uuid");
const qiniu = require("qiniu");

const accessKey = "bcIae8Et0Lf6kzuU5lFk-vud4TW8sIMqMliPHJ7I";
const secretKey = "ms7pwXuCoiJOG6nvQfszZQM3OwMutOjpvcRigh2o";
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

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
    //要上传的空间
    filename = filename || Uuid.v1();
    const bucket = "nodechat";
    const options = {
      scope: bucket + ":" + filename,
      expires: 7200,
      // saveKey: filename,
      returnBody:
        '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    const datainfo = data.replace(`${data.split(",")[0]},`, "");
    const baseUrl = "http://pry40zxwo.bkt.clouddn.com/";

    // const config = new qiniu.conf.Config();
    // // 空间对应的机房
    // config.zone = qiniu.zone.Zone_z2;
    // //上传是否使用cdn加速
    // config.useCdnDomain = true;
    // const formUploader = new qiniu.form_up.FormUploader(config);
    // const putExtra = new qiniu.form_up.PutExtra();
    // return new Promise((resolve, reject) => {
    //   formUploader.put(uploadToken, filename, data, putExtra, function(
    //     respErr,
    //     respBody,
    //     respInfo
    //   ) {
    //     if (respErr) {
    //       console.log(respErr,4444);
    //       throw respErr;
    //     }
    //     if (respInfo.statusCode == 200) {
    //       console.log(respBody, 4444);
    //       resolve(`${baseUrl}${respBody.key}`);
    //     } else {
    //       // console.log(respInfo.statusCode);
    //       // console.log(respBody);
    //     }
    //   });
    // });
    return new Promise((resolve, reject) => {
      request(
        {
          url: `http://upload-z2.qiniu.com/putb64/-1${urlpath}`, //请求路径
          method: "POST", //请求方式，默认为get
          headers: {
            //设置请求头
            "content-type": "application/octet-stream",
            Authorization: `UpToken ${uploadToken}`
          },
          body: datainfo //JSON.stringify(requestData) //post参数字符串
        },
        function(error, response, body) {
          console.log(4444, body);
          if (!error && response.statusCode == 200) {
            resolve(`${baseUrl}${JSON.parse(body).key}`);
          }
        }
      );
    });
  },
  async avatarSave(filename, data) {
    const datainfo = data.replace(/^data:image\/\w+;base64,/, "");
    const dataBuffer = Buffer.from(datainfo, "base64");
    return new Promise(() => {
      fs.writeFile(
        path.join(__dirname, `../public/avatar/${filename}`),
        dataBuffer,
        function(err, data) {
          if (err) {
            console.log(err);
          } else {
            console.log(data);
          }
        }
      );
    });
  }
};

// function dataURLtoBlob(base64){
//   var base64Arr = base64.split(',');
//   var imgtype = '';
//   var base64String = '';
//   if(base64Arr.length > 1){
//       //如果是图片base64，去掉头信息
//       base64String = base64Arr[1];
//       imgtype = base64Arr[0].substring(base64Arr[0].indexOf(':')+1,base64Arr[0].indexOf(';'));
//   }
//   // 将base64解码
//   var bytes = atob(base64String);
//   //var bytes = base64;
//   var bytesCode = new ArrayBuffer(bytes.length);
//    // 转换为类型化数组
//   var byteArray = new Uint8Array(bytesCode);

//   // 将base64转换为ascii码
//   for (var i = 0; i < bytes.length; i++) {
//       byteArray[i] = bytes.charCodeAt(i);
//   }

//   // 生成Blob对象（文件对象）
//   return new Blob( [bytesCode] , {type : imgtype});
// };
