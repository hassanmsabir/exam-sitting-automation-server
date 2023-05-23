const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define user schema
const examHallSchema = new mongoose.Schema({
  hallName: {
    type: String,
    required: true,
  },
  numRows: {
    type: Number,
    required: true,
  },
  numCols: {
    type: Number,
    required: true,
  },
});

// Create Sourse model
const ExamHall = mongoose.model("Hall", examHallSchema, "exam_hall");
module.exports = ExamHall;
