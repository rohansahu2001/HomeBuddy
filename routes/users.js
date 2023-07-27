const mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
mongoose.connect("mongodb://localhost/P_6112000_01").then(function () {
  console.log("Welcome! you are connected to MongoDB");
});
var userSchema = mongoose.Schema({
  fullname: String,
  email: String,
  username: String,
  password: String,
  mobileNumber: String,
  orderId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("user", userSchema);
