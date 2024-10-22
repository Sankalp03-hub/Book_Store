const mongoose = require("mongoose");

const user = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "user.png",
      // default: "https://cdn-icon-png.flaticon.com/128/3177/3177440.png",

    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    favourites: [
      {
        type: mongoose.Types.ObjectId,
        ref: "book",
      },
    ],
    cart: [
      {
        type: mongoose.Types.ObjectId,
        ref: "book",
      },
    ],
    orders: [
      {
        type: mongoose.Types.ObjectId,
        ref: "order",
      },
    ],
  },
  //use when update value
  { timestamps: true }
);
module.exports = mongoose.model("user", user);
