const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define user schema
const courseSchema = new mongoose.Schema({
  courseCode: String,
  courseTitle: String,
  courseCreditHours: String,
  courseAbreviation: String,
});

// Create Course model
const Course = mongoose.model("Course", courseSchema, "courses");
module.exports = Course;
