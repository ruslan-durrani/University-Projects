const mongoose = require("mongoose");

async function connectToDB() {
  try {
    await mongoose
      .connect(
        process.env.LOCALHOST
      )
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
      });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = connectToDB;
