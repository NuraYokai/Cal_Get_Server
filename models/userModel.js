const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: String,
  password: String,
});

const userModel = mongoose.model("users", UserSchema);

module.exports = userModel;
