"use strict";

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const dataSchema = new Schema({
    from: String,
    to: String,
    message: String,
    type: String,
    date: String,
    // unreadmessage:String,
    isread: JSON,
    chatid: String
  });

  return mongoose.model("historyMsg", dataSchema, "historyMsg");
};
