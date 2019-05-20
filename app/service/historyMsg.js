"use strict";

const Service = require("egg").Service;

class HistoryMsgService extends Service {
  async create(option) {
    const { from, to, message, date, unreadmessage, isread, type } = option;
    const result = await this.ctx.model.HistoryMsg.create({
      //model 注意: 第一个字母一定要大写
      from: from,
      to: to,
      message: message,
      date: date,
      isread: isread,
      type: type
      // unreadmessage: unreadmessage
    });
    return result;
  }

  async msgfind(option) {
    const { from, to } = option;
    const result = await this.ctx.model.HistoryMsg.find({
      $or: [{ from: from, to: to }, { from: to, to: from }]
    }).sort({ date: 1 });

    return result;
  }

  async unreadfind(option) {
    // const result = await this.ctx.model.OfflineMsg.find({'userId'})
    const { from, to } = option;
    const result = await this.ctx.model.HistoryMsg.find(
      { from: from, to: to, isread: 1 },
      { isread: 1, _id: 0 }
    ).count();

    return result;
  }

  async userlistfind(option) {
    // const result = await this.ctx.model.OfflineMsg.find({'userId'})
    const { to } = option;
    const result = await this.ctx.model.HistoryMsg.aggregate([
      {
        $match: {
          to: to
          // isread: 1
        }
      },
      {
        $sort: {
          _id: -1
        }
      },
      {
        $group: {
          _id: "$from",
          username: { $first: "$from" },
          message: { $first: "$message" },
          type: { $first: "$type" },
          date: { $first: "$date" },
          count: { $sum: "$isread" }
        }
      }
    ]);

    return result;
  }

  async updateUnread(option) {
    // const result = await this.ctx.model.OfflineMsg.find({'userId'})
    const { from, to } = option;
    try {
      const result = await this.ctx.model.HistoryMsg.find({
        from: to,
        to: from,
        isread: 1
      });
      console.log(result, 88888);
      result.forEach(async item => {
        await this.ctx.model.HistoryMsg.update(
          { _id: item._id },
          { $set: { isread: 0 } }
        );
      });
    } catch (error) {
      console.log("未读消息更新出错", error);
    }
  }
}
module.exports = HistoryMsgService;
