const express = require("express");
const router = express.Router();
const Students = require("../models/students.model");
const Courses = require("../models/courses.model");

// POST route to create a new student
router.post("/newstudent", async (req, res) => {
  try {
    const {
      fullname,
      firstname,
      lastname,
      gender,
      batchId,
      sectionId,
      subjectIds,
      gpa,
      regNo,
      program,
      semesterType,
      fullReg,
      cheatingHistory,
      teacherReview,
    } = req.body;
    const studentExist = await Students.findOne({ fullReg });

    if (studentExist) {
      return res
        .status(422)
        .json({ error: "A Student is already registered with this Reg No." });
    }
    // Create a new student instance
    const newStudent = new Students({
      fullname,
      firstname,
      lastname,
      gender,
      program,
      semesterType,
      fullReg,
      batchId,
      sectionId,
      subjectIds,
      gpa,
      regNo,
      cheatingHistory,
      teacherReview,
    });

    // Save the new student record to the database
    const savedStudent = await newStudent.save();

    res.status(201).json("Student Registered Successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
router.put("/updateStudent/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const options = { new: true };
    const updatedStudent = await Students.findOneAndUpdate(
      { _id: id },
      update,
      options
    );
    res.send(updatedStudent);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
router.get("/adddummyStudentsData", async (req, res) => {
  try {
    let nameCount = 81;
    let regNoCount = 81;
    for (let index = nameCount; index < 106; index++) {
      let thisGpa = (Math.random() * (4 - 2) + 2).toFixed(1);
      let thisTeacherReview =
        parseFloat(thisGpa) > 3.5
          ? "1"
          : parseFloat(thisGpa) > 3.2
          ? "2"
          : (Math.random() * (5 - 3) + 3).toFixed(0);
      let hasCheated = Math.floor(Math.random() * (2 - 0) + 0) >= 1 ? 1 : 0;
      let obj = {
        firstname: "dummy" + nameCount,
        lastname: "last" + nameCount,
        fullname: `dummy${nameCount} last${nameCount}`,
        gender: Math.floor(Math.random() * 2) == 1 ? "female" : "male",
        program: "BSE",
        semesterType: "SP19",
        fullReg:
          "SP19-BSE-" + (regNoCount > 9 ? "0" : "00") + regNoCount.toString(),
        batchId: "645fc22c475c5cbc8c6a0409",
        sectionId: "645fc22d475c5cbc8c6a0410",
        subjectIds: [
          "644d5205a7adda313f0610fc",
          "644d522ca7adda313f061100",
          "644d529da7adda313f061108",
          "644d5262a7adda313f061104",
        ],
        gpa: thisGpa,
        regNo: (regNoCount > 9 ? "0" : "00") + regNoCount.toString(),
        cheatingHistory: hasCheated,
        teacherReview: thisTeacherReview,
      };
      console.log("student no ", index);

      const studentExist = await Students.find({ fullReg: obj.fullReg });
      if (studentExist.length > 0) {
        res.status(500).json({ error: "Server error" });
        return;
      }
      const newStudent = new Students(obj);

      // Save the new student record to the database
      await newStudent.save();
      nameCount = nameCount + 1;
      regNoCount = regNoCount + 1;
    }
    // Create a new student instance

    res.status(201).json("Students Registered Successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/listAllStudents", async (req, res) => {
  Students.find()
    .then((data) =>
      res.send({
        entry: data,
        total: data.length,
      })
    )
    .catch((err) => console.log(err));
});
router.delete("/deleteStudentData/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteStudent = await Students.findOneAndDelete({ _id: id });
    res.send(deleteStudent);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
module.exports = router;
