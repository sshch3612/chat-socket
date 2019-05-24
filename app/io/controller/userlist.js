const Controller = require("egg").Controller;

/**
 * getList所有用户列表
 * */
class UserlistController extends Controller {
  async Userlist() {
    const { ctx, app } = this;
    const reqdata = ctx.args[0];
    const socketId = ctx.socket.id;
    // await app.redis.del('userInfo');
    // const result = await app.redis.hvals("userInfo");
    const result = await this.ctx.service.historyMsg.userlistfind({
      from: reqdata["from"]
    });
    await ctx.socket.nsp.sockets[socketId].emit("userlist", {
      message: result
    }); //发给指定的用户
  }

  //获取用户通讯录
  async friendsUser() {
    const { ctx, app } = this;
    const { username } = ctx.args[0];
    const socketId = ctx.socket.id;
    // await app.redis.del('userInfo');
    // const result = await app.redis.hvals("userInfo");
    try {
      const result = await this.ctx.service.user.friendsUser({
        username: username
      });
      //返回通讯录
      await ctx.socket.nsp.sockets[socketId].emit("friendsUser", {
        message: result
      }); 
    } catch (error) {
      console.log(error,44);
    }
  }
}

module.exports = UserlistController;
