"use strict";

module.exports = app => {
  return async (ctx, next) => {
    // ctx.socket.emit('res', 'packet received!');
    // console.log('packet:', ctx);
    ctx.socket.on("singlechat", function(data) {
      ctx.req.args[0] = {
        from: "test1",
        to: "test2",
        type: "text",
        date: 1558628596031,
        message: "eedaffeffeafe"
      };
      console.log(ctx.req.args[0], data);
    });
    await next(ctx);
  };
};
