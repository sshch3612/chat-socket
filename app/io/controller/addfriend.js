const Controller = require("egg").Controller;

class AddfriendController extends Controller {
  async addfriend(arg) {
    const { ctx, app } = this;

    // const message = this.args[0];
    const { from, to } = ctx.args[0];
    const socketId = ctx.socket.id;
    try {
      //查询用户是否存在
      const user = await ctx.service.user.getUser({ username: from });
      if (user) {
        //更新from user-friends表
        const chatId = [from, to].sort().join("");
        await ctx.service.user.updateUser(
          { username: from },
          { [`friends.${to}`]: { exist: 1, chatid: chatId } }
        );
        //更新to user-friends表
        await ctx.service.user.updateUser(
          { username: to },
          { [`friends.${from}`]: { exist: 1, chatid: chatId } }
        );

        //给from方发送系统消息通知
        const messageSys = "通过验证,我们已经成为朋友";
        const dateSys = Date.now();
        await ctx.socket.nsp.sockets[socketId].emit("singlechatOut", {
          code: 200,
          from: to,
          type: "text",
          message: messageSys,
          date: dateSys
        });
        //存储系统消息
        this.ctx.service.historyMsg.create({
          chatid: chatId,
          type: "text",
          from: to,
          to: from,
          isread: {[from]:1},
          message: messageSys,
          date: dateSys
        });
      } else {
        await ctx.socket.nsp.sockets[socketId].emit("addfriend", {
          code: 203,
          message: "该用户不存在"
        }); //发给指定的用户
      }
    } catch (error) {
      console.log(error, 999);
    }
    //添加成功，直接发送消息

    // ctx.socket.emit('ping', 'ping成功')
  }
}

module.exports = AddfriendController;
