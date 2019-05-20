"use strict";

const Controller = require("egg").Controller;
const md5 = require("js-md5");

class SingleChatController extends Controller {
  async Singlechat() {
    const { ctx, app } = this;
    const reqdata = ctx.args[0];
    const socketId = ctx.socket.id;
    // console.log(typeof message,message,message['userId'] ,444);

    //解析信息
    // const  fromDate = reqdata["date"];
    // const fromUser = reqdata["from"];
    // const fromMessage  = reqdata["message"];
    // let toUser = null;

    //可以做一些业务逻辑
    //发消息,要验证1接受人是否存在 2.两者之间的关系
    try {
      //给From发送回包
      await ctx.socket.nsp.sockets[socketId].emit("singlechat", {
        from: reqdata["from"],
        type: reqdata['type'],
        message: reqdata["message"],
        date: reqdata["date"]
      });
      //获取接收人的信息,
      if (!reqdata["to"]) {
        await ctx.socket.nsp.sockets[socketId].emit("singlechat", {
          code: "10004",
          error: "用户不能为空"
        });
        return;
      }
      let toUser = await app.redis.hget("userInfo", md5(reqdata["to"]));
      //判断接受人是否存在
      if (toUser === null) {
        await ctx.socket.nsp.sockets[socketId].emit("singlechat", {
          code: "10003",
          error: "用户不存在"
        });
        return;
      }

      //to 用户信息
      toUser = JSON.parse(toUser);
      //判断用户状态 status 1 2 3
      const userStatus = toUser.status;
      let msgType = null;
      switch (userStatus) {
        case 1:
          msgType = "singlechat";
          break;
        case 2:
          // sendMsg = "房间外";
          msgType = "singlechatOut";
          break;
        case 3: //对status不做处理//断开重连
          // sendMsg = "状态更新成功";
          if (toUser.room && toUser.room === reqdata["from"]) {
            msgType = "singlechat";
          } else {
            msgType = "singlechatOut";
          }
          break;
        default:
          sendMsg = "状态码不正确";
          break;
      }

      // const isOnline = await app.redis.hexists("online", toUser.socketid);
      // console.log(await app.redis.hget("online", toUser.socketid));

      if (msgType === "singlechatOut") {
        /*
         *1存储singlechatOut 消息
         *2查询所有离线消息 数
         *发送 count
         *发送 新消息
         *客户端主动删除所有离线消息
         */
        await this.ctx.service.historyMsg.create({
          to: reqdata["to"],
          from: reqdata["from"],
          message: reqdata["message"],
          type: reqdata['type'],
          isread: 1,
          date: reqdata["date"]
        });
        //获取未读消息数
        const count = await this.ctx.service.historyMsg.unreadfind({
          from: reqdata["from"],
          to: reqdata["to"]
        });
        console.log("countcount", count);
        //发送消息 count
        await ctx.socket.nsp.sockets[toUser.socketid].emit("singlechatOut", {
          from: reqdata["from"],
          type: reqdata['type'],
          message: reqdata["message"],
          count: count,
          date: reqdata["date"]
        });
        //更新userInfo表
      } else {
        await ctx.socket.nsp.sockets[toUser.socketid].emit("singlechat", {
          from: reqdata["from"],
          type: reqdata['type'],
          message: reqdata["message"],
          date: reqdata["date"]
        });
        //存储所有聊天消息
        this.ctx.service.historyMsg.create({
          from: reqdata["from"],
          to: reqdata["to"],
          type: reqdata['type'],
          isread: 0,
          message: reqdata["message"],
          date: reqdata["date"]
        });
      }
      // } else {
      //   //离线状态的信息发送
      //   //离线消息保存
      //   // ctx.socket.emit()
      //   //     userId: String ,
      //   // from: String,
      //   // message: String,
      //   // date: Date,

      // }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = SingleChatController;
