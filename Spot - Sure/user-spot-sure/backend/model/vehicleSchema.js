const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  model: {
    type: Number,
    default: "",
  },
  vehicleType: {
    type: String,
    required: true,
  },
  vinNumber: {
    type: Number,
    required:true
  },
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  }
});


const vehicle = mongoose.model("vehicles", vehicleSchema);

module.exports = vehicle;
