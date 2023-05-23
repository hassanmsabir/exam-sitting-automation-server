const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define user schema
const batchSchema = new mongoose.Schema({
  batchName: String,
  programName: String,
});

// Create Course model
const Batch = mongoose.model("Batch", batchSchema, "Batches");
module.exports = Batch;
