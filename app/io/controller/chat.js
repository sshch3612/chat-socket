const Controller = require('egg').Controller;

class ChatController extends Controller {
  async exchange() {
    console.log(45555);
    const { ctx, app } = this;
    ctx.socket.emit('ping','pingc成功')
    // ctx.socket.emit('ping', 'ping成功')
  }
  async message(arg) {
    const { ctx, app } = this;
 
    // const message = this.args[0];
    const message = ctx.req.args[0];
    ctx.socket.emit('message',`${message}`)
    // ctx.socket.emit('ping', 'ping成功')
  }
    
}

module.exports = ChatController;