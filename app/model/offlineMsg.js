'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const dataSchema = new Schema({
    to: String ,
    from: String,
    message: String,
    date: String,
  });

  return mongoose.model('offlineMsg', dataSchema, 'offlineMsg');
};
