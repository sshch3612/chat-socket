"use strict";

const Service = require("egg").Service;

class UserService extends Service {
  async getUser(option, projection = {}) {
    this.ctx.logger.info("dfagd");
    const result = await this.ctx.model.User.findOne(option, projection);
    // this.ctx.logger.info(result, "结果");
    return result;
  }

  async createUser(option) {
    this.ctx.logger.info("创建user");
    const { username, password, phone, wxNumber } = option;
    const result = await this.ctx.model.User.create({
      username: username || null,
      password: password || null,
      // qqCode:qqCode || null,
      phone: phone || null,
      wxNumber: wxNumber || null,
      date: new Date().toLocaleString()
    });
    return result;
  }
  async updateUser(option, projection = {}) {
    const result = await this.ctx.model.User.update(option, {
      $set: projection
    });
    this.ctx.logger.info(result, "结果");
    return result;3
  }

  async friendsUser(option, projection = {friends:1,_id:0}) {
    const fromUser = await this.ctx.model.User.findOne(option,projection);
    const result = [];
    for await (const item of Object.keys(fromUser.friends)){
      const oneUser =  await this.getUser({username:item},{username:1});
      result.push(oneUser);
    }
    return result;
  }
}
module.exports = UserService;
