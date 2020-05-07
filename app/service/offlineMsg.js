'use strict';

const Service = require('egg').Service;

class OfflineService extends Service {
  async create(option) {
    const { to, from, message, date } = option;
    const result = await this.ctx.model.OfflineMsg.create({ // model 注意: 第一个字母一定要大写
      to,
      from,
      message,
      date,
    });
    return result;
  }

  async findofflineMsg(option) {
    // const result = await this.ctx.model.OfflineMsg.find({'userId'})
    const { from, to } = option;
    const result = await this.ctx.model.OfflineMsg.find({ from, to }).count();

    return result;
  }
}
module.exports = OfflineService;
