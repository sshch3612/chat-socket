'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const dataSchema = new Schema({
    username: String,
    password: String,
    qqCode: String,
    phone: String,
    wxNumber: String,
    date: Date,
    friends: JSON,
  }, { collection: 'user', versionKey: false });
  // const userModel = mongoose.model('User', dataSchema, 'user');
  // return userModel;
  return mongoose.model('User', dataSchema, 'user');
};
