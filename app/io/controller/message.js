const Controller = require('egg').Controller;

/** 
 * 一对一聊天
 * */
class ChatController extends Controller {
  async message() {
    const { ctx, app } = this;
    const message = ctx.args[0]
    const socketId = await app.redis.get(message['to']);
    const a = await app.redis.get('test01');
    const b=  await app.redis.get('test02');
    console.log(message);
  }
    
}

module.exports = ChatController;