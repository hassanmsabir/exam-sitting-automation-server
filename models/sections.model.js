const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define user schema
const sectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    required: true,
  },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
    required: true,
  },
});

// Create Sourse model
const Section = mongoose.model("Section", sectionSchema, "sections");
module.exports = Section;
