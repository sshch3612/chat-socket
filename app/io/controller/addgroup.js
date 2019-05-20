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
  async addgroup() {
    const { ctx, app } = this;
    const message = ctx.args[0];
    const socketId = ctx.socket.id;
    const groupId = message['groupId'];
    await ctx.socket.join(groupId, function () {
      console.log(ctx.socket.rooms,444);
    });
    ctx.app.io.of('/').to(groupId).emit('online', { msg: 'welcome', id: ctx.socket.id });
    // console.log(typeof message,message,message['userId'] ,444);
    // app.redis.set(message['userId'],socketId,function(err,response){
    //   console.log(err,response,333);
    //   });//将注册信息存储到redis中
    // 用户信息
    // console.log(socketId,444, ctx.socket.nsp.sockets);
    // console.log(query, room, userId, this.socket);
  // await ctx.socket.nsp.sockets[socketId].emit('addgroup', '添加成功');//发给指定的用户
  }
}

module.exports = AddgroupController;


