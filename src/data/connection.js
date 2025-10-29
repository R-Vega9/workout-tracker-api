const mongoose = require("mongoose");

function connectDB(uri = process.env.DATABASE_URI) {
  if (!uri) {
    console.error("DATABASE_URI is missing");
    return Promise.reject(new Error("DATABASE_URI is missing"));
  }

  // Return the promise so caller can .then()/.catch()
  return mongoose.connect(uri, {
    serverSelectionTimeoutMS: 30000, // gives free-tier Mongo time to wake up
    socketTimeoutMS: 45000,
  });
}

module.exports = connectDB;