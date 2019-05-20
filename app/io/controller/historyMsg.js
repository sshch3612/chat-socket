"use strict";

const Controller = require("egg").Controller;

/**
 * 获取离线消息
 * */
class HistoryMsgController extends Controller {
  async historyMsg() {
    const { ctx, app } = this;
    const message = ctx.args[0];
    const { from, to } = message;
    const socketId = ctx.socket.id;
    try {
      const result = await ctx.service.historyMsg.msgfind({ from, to });
      await ctx.socket.nsp.sockets[socketId].emit("historyMsg", {
        code: "100002",
        message: result
      }); //发给指定的用户
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = HistoryMsgController;
