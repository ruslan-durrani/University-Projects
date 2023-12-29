const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String
  },
  creationDate: {
    type: Date,
    default: Date.now,
  }
});


const organization = mongoose.model("organization", organizationSchema);

module.exports = organization;
