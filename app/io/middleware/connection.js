// {app_root}/app/io/middleware/connection.js
module.exports = app => {
  return async (ctx, next) => {
    const socketId = ctx.socket.id;
    console.log("socket连接");
    // await ctx.socket.emit('connect',{code:'10002',message:'连接成功'})
    //建立在线表
    try {
      await app.redis.hset(
        "online",
        socketId,
        JSON.stringify({ date: Date.now() })
      );
    } catch (error) {}

    await next();

    // app.redis.hset('userInfo',md5(message['userId']),{online:1})
    console.log("socket断开");
    try {
      const leave = await app.redis.hdel("online", socketId);
      console.log(leave, 444);
    } catch (error) {}
  };
};
