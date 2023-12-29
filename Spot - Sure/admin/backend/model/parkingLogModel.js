const mongoose = require('mongoose');

const parkingSchema = new mongoose.Schema({
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  startDate: {
    type: String,
  },
  endDate: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true, // assuming you have a User model
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'vehicles',
    required: true,// assuming you have a Vehicle model
  }
});

const ParkingLog = mongoose.model('ParkingLog', parkingSchema);

module.exports = ParkingLog;
