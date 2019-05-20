'use strict';
/**
 * 用户注册功能 
 * {
 * 'event':'addGrounp',
 * 'data':{
 *  'groupId':'id'
 * 'userId':'test01'
 * }
 * }
 * {'userId':'test01'}
 * */
const Save = {

};

const Controller = require('egg').Controller;

class AddgroupController extends Controller {
  async groupchat() {
    const { ctx, app } = this;
    const message = ctx.args[0];
    const socketId = ctx.socket.id;
    const Groupid = message['groupId'];
    ctx.socket.nsp.adapter.clients([Groupid], (err, clients) => {
      console.log(err, clients, 5555, ctx.socket)
    })
    ctx.app.io.of('/').to(Groupid).emit('res', { msg: 'welcome', id: ctx.socket.id });
  }
}

module.exports = AddgroupController;


