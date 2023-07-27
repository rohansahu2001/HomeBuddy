const mongoose = require("mongoose");
var orderSchema = mongoose.Schema({
  service: String,
  price: String,
  date: String,
  prefferedTime: String,
  address: String,
  instruction: {
    type: String,
    default: "none",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});
module.exports = mongoose.model("order", orderSchema);
