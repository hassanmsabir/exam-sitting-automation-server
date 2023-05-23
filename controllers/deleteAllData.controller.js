const express = require("express");
const CourseMapping = require("../models/Mapping/courseMappings.model");
const Batch = require("../models/batches.model");
const Section = require("../models/sections.model");
const Schedule = require("../models/exam-schedule.model");
const Students = require("../models/students.model");
const router = express.Router();

router.use(express.json());

router.delete("/deleteAllCourseMaps", async (req, res) => {
  try {
    const deletedData = await CourseMapping.deleteMany();
    res.send(deletedData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
router.delete("/deleteAllBatches", async (req, res) => {
  try {
    const deletedData = await Batch.deleteMany();
    res.send(deletedData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
router.delete("/deleteAllExamSchedules", async (req, res) => {
  try {
    const deletedData = await Schedule.deleteMany();
    res.send(deletedData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
router.delete("/deleteAllStudents", async (req, res) => {
  try {
    const deletedData = await Students.deleteMany();
    res.send(deletedData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
router.delete("/deleteAllSections", async (req, res) => {
  try {
    const deletedData = await Section.deleteMany();
    res.send(deletedData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
module.exports = router;
