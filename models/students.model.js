const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define user schema
const studentSchema = new mongoose.Schema({
  program: {
    type: String,
    required: true,
  },
  semesterType: {
    type: String,
    required: true,
  },
  regNo: {
    type: String,
    required: true,
  },
  fullReg: String,
  fullname: String,
  firstname: {
    type: String,
    required: true,
  },
  lastname: String,
  gender: {
    type: String,
    required: true,
  },
  gpa: {
    type: Number,
    required: true,
    min: 0,
    max: 4.0,
    default: 0.0,
  },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
    required: true,
  },
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
    required: true,
  },
  subjectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "CourseMapping" }],
  teacherReview: String,
  cheatingHistory: Number,
});

// Create Course model
const Students = mongoose.model("Student", studentSchema, "students");
module.exports = Students;
