'use strict';

const Service = require('egg').Service;

class HistoryMsgService extends Service {
  async create(option) {
    const {
      from,
      to,
      message,
      date,
      unreadmessage,
      isread,
      type,
      chatid,
    } = option;
    const result = await this.ctx.model.HistoryMsg.create({
      // model 注意: 第一个字母一定要大写
      from,
      to,
      message,
      date,
      isread,
      type,
      chatid,
      // unreadmessage: unreadmessage
    });
    return result;
  }

  async msgfind(option) {
    const { from, to, number, page } = option;
    const chatId = [ from, to ].sort().join('');
    const limitNumber = number * page;
    const result = await this.ctx.model.HistoryMsg.aggregate([
      {
        $match: {
          chatid: chatId,
        },
      },
      {
        $sort: {
          date: -1,
        },
      },
      // { $skip: `${(page - 1) * number}` },
      {
        $limit: number * page,
      },
      {
        $sort: {
          date: 1,
        },
      },
    ]);
    // find({
    //   // $or: [{ from: from, to: to }, { from: to, to: from }]
    //   chatid: chatId
    // })
    //   .sort({ date: -1 })
    //   .limit(10);

    return result;
  }

  async unreadfind(option) {
    // const result = await this.ctx.model.OfflineMsg.find({'userId'})
    const { from, to } = option;
    const result = await this.ctx.model.HistoryMsg.find(
      { from, to, isread: { [to]: 1 } },
      { isread: 1, _id: 0 }
    ).countDocuments();

    return result;
  }

  async userlistfind(option) {
    // const result = await this.ctx.model.OfflineMsg.find({'userId'})
    const { from } = option;
    // 获取用户聊天列表users
    const userList = await this.ctx.model.User.findOne(
      {
        username: from,
      },
      { friends: 1, _id: 0 }
    );
    const friends = userList.friends;
    const chatidResult = [];
    Object.values(friends).forEach(item => {
      if (item.exist === 1) {
        chatidResult.push(item.chatid);
      }
    });

    const result = await this.ctx.model.HistoryMsg.aggregate([
      {
        $match: {
          chatid: { $in: chatidResult },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $group: {
          _id: '$chatid',
          username: { $first: '$chatid' },
          message: { $first: '$message' },
          type: { $first: '$type' },
          date: { $first: '$date' },
          count: { $sum: `$isread.${from}` },
        },
      },
    ]);
    return result.map(item => {
      return { ...item, username: item.username.replace(from, '') };
    });
  }

  async updateUnread(option) {
    // const result = await this.ctx.model.OfflineMsg.find({'userId'})
    const { from, to } = option;
    try {
      const result = await this.ctx.model.HistoryMsg.find({
        from: to,
        to: from,
        isread: { [from]: 1 },
      });
      result.forEach(async item => {
        await this.ctx.model.HistoryMsg.update(
          { _id: item._id },
          { $set: { isread: { [from]: 0 } } }
        );
      });
    } catch (error) {
      console.log('未读消息更新出错', error);
    }
  }
}
module.exports = HistoryMsgService;
