"use strict";

const Controller = require("egg").Controller;

class LoginController extends Controller {
  async signout() {
    const { request, response, locals, helper } = this.ctx;
    const { username } = locals;
    try {
      await this.app.redis.hdel("userToken", username);
      response.body = {
        code: 200,
        message: "账号退出成功"
      };
    } catch (error) {
      response.body = {
        code: 203,
        message: "账号退出异常"
      };
    }
  }

  async registered() {
    const { request, response, logger, helper } = this.ctx;
    const { username, password } = request.body;
    if (!(username && password)) {
      response.body = {
        code: "20003",
        message: "账号、密码不能为空"
      };
      return response.body;
    }
    const user = await this.ctx.service.user.getUser({ username: username });
    if (user) {
      response.body = {
        code: "20001",
        message: "用户已存在"
      };
    } else {
      await this.ctx.service.user.createUser({
        username: username,
        password: password
      });
      this.ctx.status = 200;
      this.ctx.body = {
        code: "20000",
        message: "注册成功"
      };
    }
    return response.body;
  }

  async login() {
    const { request, response, logger, helper, service } = this.ctx;
    const { username, password } = request.body;
    try {
      const dbresult = await service.user.getUser({ username: username });
      if (dbresult) {
        if (dbresult.password === password) {
          //token存放到redis
          //userToken  {[username]:token}
          const token = helper.generateToken({
            username: username,
            password: password
          });
          await this.app.redis.hset("userToken", username, token);
          response.body = {
            code: 200,
            message: "登陆成功",
            token: token
          };
        } else {
          response.body = {
            code: 201,
            message: "密码不正确",
            data: dbresult,
            password: password
          };
        }
      } else {
        response.body = {
          code: 201,
          message: "用户不存在"
        };
      }
    } catch (error) {
      response.body = {
        code: 204,
        message: "登陆异常，请重新登陆"
      };
    }
    // return response.body;
  }

  async getUser() {
    const { request, response, locals, service } = this.ctx;
    const { username } = locals;
    let user = null;
    if (request.method === "POST") {
      const { touser } = request.body;
      user = await service.user.getUser(
        { username: touser },
        { password: 0, _id: 0 }
      );
    } else {
      user = await service.user.getUser(
        { username: username },
        { password: 0, _id: 0 }
      );
    }
    response.body = {
      code: 200,
      message: user
    };
  }

  async updateAvatar() {
    const { request, response, locals, service, helper } = this.ctx;
    const { username } = locals;
    const { avatar } = request.body;
    try {
      const avatatUrl = await helper.fileUpload("/user/avatar", avatar);
      await service.user.updateUser(
        {
          username: username
        },
        {
          avatar: avatatUrl
        }
      );
      const user = await service.user.getUser(
        { username: username },
        { password: 0, _id: 0 }
      );
      response.body = {
        code: 200,
        message: user
      };
      // const result = await helper.fileUpload('/user/avatar',avatar);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = LoginController;
