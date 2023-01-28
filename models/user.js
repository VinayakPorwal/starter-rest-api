const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  Api_key: {
    type: String,
    default: "none",
  },
  Admin: {
    type: Boolean,
    default: false,
  },
  Wallet: {
    type: Number,
    default: 50,
  },
  Bio: {
    type: String,
    default: "none",
  },
  img: {
    data: Buffer,
    contentType: String,
  },
});

const ImageSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  data: {
    type: Buffer,
    required: true,
  },
});
const Image = mongoose.model("Image", ImageSchema);
const User = mongoose.model("user", UserSchema);
// user.createIndexes();
module.exports = { User, Image };
