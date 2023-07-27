const mongoose = require("mongoose");
var serviceCategorySchema = mongoose.Schema({
  serviceName: String,
  servicePoster: String,
  serviceCategory: Array,
});
module.exports = mongoose.model("serviceCategory", serviceCategorySchema);
