'use strict';

const Controller = require('egg').Controller;

/** 
 * 获取离线消息
 * */
class OfflineMsgController extends Controller {
  async message() {
    const { ctx, app } = this;
    const message = ctx.args[0]
    const socketId = await app.redis.get(message['to']);
    
    console.log(message, socketId,a , b,  ctx.socket.nsp.sockets );
    await ctx.socket.nsp.sockets[socketId].emit('message', message['message']);//发给指定的用户
  }
    
}

module.exports = OfflineMsgController;