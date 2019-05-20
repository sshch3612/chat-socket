"use strict";
/**
 * 用户注册功能
 * {
 * 'event':'Registered',
 * 'data':{
 * 'userId':'test01'
 * }
 * }
 * {'userId':'test01'}
 * */
const Save = {};

const Controller = require("egg").Controller;
const md5 = require("js-md5");

class RegisteredController extends Controller {
  async Registered() {
    const { ctx, app } = this;
    const message = ctx.args[0];
    //{status:0,userId:''},
    const socketId = ctx.socket.id;
    const { userId, status, room } = message;
    let sendMsg = null;
    // if (!userId) {
    //   await ctx.socket.nsp.sockets[socketId].emit("registered", {
    //     message: "注册失败 "
    //   });
    //   return;
    // } else {
    // }

    //发送回包
    switch (status) {
      case 1:
        sendMsg = "房间内";
        break;
      case 2:
        sendMsg = "房间外";
        break;
      case 3: //对status不做处理
        sendMsg = "状态更新成功";
        break;
      default:
        sendMsg = "状态码不正确";
        break;
    }

    try {
      await app.redis.hset(
        "userInfo",
        md5(message["userId"]),
        JSON.stringify({
          username: message["userId"],
          socketid: socketId,
          status: status,
          room: room,
          date: Date.now()
        })
      );

      ctx.socket.nsp.sockets[socketId].emit("registered", {
        message: sendMsg
      });
      //进入房间之后，清除未读消息，update historyMsg  isread:2
      if (status === 1) {
        ctx.service.historyMsg.updateUnread({ from: userId, to: room });
      }
    } catch (error) {
      ctx.socket.nsp.sockets[socketId].emit("registered", {
        message: "状态更新出错",
        error: error
      });
    }
  }
}

module.exports = RegisteredController;
