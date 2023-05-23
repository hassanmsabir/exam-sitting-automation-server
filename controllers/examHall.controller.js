const ExamHall = require("../models/examHall.model");
const express = require("express");
const router = express.Router();

// Add new exam hall
async function addExamHall(req, res) {
  const { hallName, numRows, numCols } = req.body;
  try {
    const examHallExists = ExamHall.find({ hallName });

    if (examHallExists.length > 0) {
      return res.status(422).json("Exam Hall Already Exists");
    }
    const examHall = new ExamHall({ hallName, numRows, numCols });
    const savedExamHall = await examHall.save();
    return res.status(201).json(savedExamHall);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Update existing exam hall
async function updateExamHall(req, res) {
  const { hallName, numRows, numCols } = req.body;
  const { hallId } = req.params;
  try {
    const updatedExamHall = await ExamHall.findByIdAndUpdate(
      hallId,
      { hallName, numRows, numCols },
      { new: true }
    );
    if (!updatedExamHall) {
      return res.status(404).json({ message: "Exam hall not found" });
    }
    return res.json(updatedExamHall);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Delete exam hall
async function deleteExamHall(req, res) {
  const { hallId } = req.params;
  try {
    const deletedExamHall = await ExamHall.findByIdAndDelete(hallId);
    if (!deletedExamHall) {
      return res.status(404).json({ message: "Exam hall not found" });
    }
    return res.json(deletedExamHall);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Get all exam halls
async function getAllExamHalls(req, res) {
  try {
    const examHalls = await ExamHall.find();
    return res.json(examHalls);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
// Get all exam halls
async function getExamHallById(req, res) {
  try {
    const examHallId = req.params.id;
    const examHall = await ExamHall.findById(examHallId);

    if (!examHall) {
      return res.status(404).json({ message: "Exam hall not found" });
    }

    res.json(examHall);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

router.get("/list_all_exam_hall", getAllExamHalls);
router.get("/list_exam_hall/:id", getExamHallById);
router.post("/add_exam_hall", addExamHall);
router.put("/exam_hall/:id", updateExamHall);
router.delete("/exam_hall/:id", deleteExamHall);
module.exports = router;
