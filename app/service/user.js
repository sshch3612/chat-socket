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
    const { username, password, phone, wxNumber, avatar } = option;
    const result = await this.ctx.model.User.create({
      username: username || null,
      avatar:
        avatar ||
        "https://upload.jianshu.io/users/upload_avatars/7072486/058e8c2c-2cf7-430b-b652-a223b7244c11",
      password: password || null,
      // qqCode:qqCode || null,
      phone: phone || null,
      wxNumber: wxNumber || null,
      date: new Date().toLocaleString()
    });
    return result;
  }
  async updateUser(option, projection = {}) {
    try {
      const result = await this.ctx.model.User.updateOne(option, {
        $set: projection
      });
      console.log(3333333);
      return result;
    } catch (error) {
      console.log(error, 4444);
    }
  }

  async friendsUser(option, projection = { friends: 1, _id: 0 }) {
    const fromUser = await this.ctx.model.User.findOne(option, projection);
    const result = [];
    for await (const item of Object.keys(fromUser.friends)) {
      const oneUser = await this.getUser({ username: item }, { username: 1 });
      result.push(oneUser);
    }
    return result;
  }
}
module.exports = UserService;
