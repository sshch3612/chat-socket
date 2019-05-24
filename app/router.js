"use strict";

/**
 * @param {Egg.Application} app - egg application
/**
 *
 *
 * @param {*} app
 */
module.exports = app => {
  const { router, controller, io } = app;
  router.get("/", controller.home.index);
  router.get("/getUsers", controller.home.getUsers);
  router.post("/createUsers", controller.home.createUsers);
  router.get("/getList", controller.list.getList);
  //注册
  router.post("/registered", controller.login.registered);
  //login
  router.post("/login", controller.login.login);
  //用户退出
  router.get("/singout", controller.login.signout);
  //用户信息
  router.get("/getUser", controller.login.getUser);
  router.post("/getUser", controller.login.getUser);
  //头像更新
  router.post("/updateAvatar", controller.login.updateAvatar);
  // io.of('/').route('ping',     io.controller.chat.ping);
  io.of("/").route("exchange", io.controller.chat.exchange);
  io.of("/").route("message", io.controller.message.message);
  io.of("/").route("registered", io.controller.registered.Registered);
  io.of("/").route("singlechat", io.controller.singlechat.Singlechat);
  io.of("/").route("addgroup", io.controller.addgroup.addgroup);
  io.of("/").route("groupchat", io.controller.groupchat.groupchat);
  io.of("/").route("userlist", io.controller.userlist.Userlist);
  //历史消息
  io.of("/").route("historyMsg", io.controller.historyMsg.historyMsg);
  //添加好友
  io.of("/").route("addfriend", io.controller.addfriend.addfriend);
  //获取好友列表
  io.of("/").route("friendsUser", io.controller.userlist.friendsUser);
};
