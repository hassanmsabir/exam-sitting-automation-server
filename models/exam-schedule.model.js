const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define user schema
const scheduleSchema = new mongoose.Schema({
  classesData: [
    {
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
      teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
    },
  ],
  examDate: {
    type: String,
    required: true,
  },
  examTime: {
    type: String,
    required: true,
  },

  examName: {
    type: String,
    required: true,
  },
  hallId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hall",
    required: true,
  },
  seatingArrangement: [
    {
      type: Object,
      default: null,
    },
  ],
});

// Create Sourse model
const Schedule = mongoose.model(
  "ExamSchedule",
  scheduleSchema,
  "exam_schedule"
);
module.exports = Schedule;
