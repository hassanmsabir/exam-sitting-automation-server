const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define user schema
const courseMappingSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
  currentStatus: {
    type: String,
    required: true,
  },
});

// Create Course model
const CourseMapping = mongoose.model(
  "CourseMapping",
  courseMappingSchema,
  "course_mappings"
);
module.exports = CourseMapping;
