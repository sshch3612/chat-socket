const Controller = require('egg').Controller;

/** 
 * 一对一聊天
 * */
class ChatController extends Controller {
  async message() {
    const { ctx, app } = this;
    const message = ctx.args[0]


    //维持一张客户状态表
    const socketId = await app.redis.get(message['to']);
    const a = await app.redis.get('test01');
    const b=  await app.redis.get('test02');
    console.log(message, socketId,a , b,  ctx.socket.nsp.sockets );
    await ctx.socket.nsp.sockets[socketId].emit('message', message['message']);//发给指定的用户
  }
    
}

module.exports = ChatController;