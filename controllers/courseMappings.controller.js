const express = require("express");
const CourseMapping = require("../models/Mapping/courseMappings.model");
const User = require("../models/users.model");
const Batch = require("../models/batches.model");
const Course = require("../models/courses.model");
const Section = require("../models/sections.model");
const Student = require("../models/students.model");
const router = express.Router();

router.use(express.json());

// POST /login - user login
router.post("/addCourseMap", async (req, res) => {
  console.log("reqqqqqq", req.body);

  const { courseId, teacherId, batchId, sectionId, currentStatus } = req.body;

  const courseMapExists = await CourseMapping.findOne({
    courseId,
    batchId,
    sectionId,
  });

  if (courseMapExists) {
    return res.status(422).json({
      error: "Same Course is already registered with this Class",
    });
  }

  const courseMap = new CourseMapping({
    courseId,
    teacherId,
    batchId,
    sectionId,
    currentStatus,
  });

  await courseMap.save();
  res.status(200).json("New Course Map Registered Successfully");
});

router.put("/updateCourseMap/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const options = { new: true };
    const updatedCourseMap = await CourseMapping.findOneAndUpdate(
      { _id: id },
      update,
      options
    );
    res.send(updatedCourseMap);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/listAllCourseMaps", async (req, res) => {
  try {
    const courseMapData = await CourseMapping.find();

    const finalData = await Promise.all(
      courseMapData.map(async (courseMap) => {
        const batchData = await Batch.findById(courseMap.batchId);
        const courseData = await Course.findById(courseMap.courseId);
        const sectionData = await Section.findById(courseMap.sectionId);
        const teacherData = await User.findById(courseMap.teacherId);

        return {
          _id: courseMap._id,
          batchId: courseMap.batchId,
          batchName: batchData ? batchData.batchName : "",
          programName: batchData ? batchData.programName : "",
          courseId: courseMap.courseId,
          courseFullTitle: courseData
            ? `${courseData.courseAbreviation} - ${courseData.courseTitle}`
            : "",
          teacherId: courseMap.teacherId,
          teacherFullName: teacherData ? teacherData.name : "",
          sectionId: courseMap.sectionId,
          sectionName: sectionData ? sectionData.sectionName : "",
          currentStatus: courseMap.currentStatus,
        };
      })
    );

    res.send({
      entry: finalData,
      total: finalData.length,
    });
  } catch (err) {}
});
router.get("/listAllCoursesWithATeacher/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const courseMapData = await CourseMapping.find({ teacherId: id });

    const finalData = await Promise.all(
      courseMapData.map(async (courseMap) => {
        console.log("courseMap", courseMap);
        const batchData = await Batch.findById(courseMap.batchId);
        const courseData = await Course.findById(courseMap.courseId);
        const sectionData = await Section.findById(courseMap.sectionId);
        const teacherData = await User.findById(courseMap.teacherId);
        const studentsData = await Student.find({
          subjectIds: courseMap.courseId,
          batchId: batchData._id,
          sectionId: sectionData._id,
        });

        return {
          _id: courseMap._id,
          batchId: courseMap.batchId,
          batchName: batchData ? batchData.batchName : "",
          programName: batchData ? batchData.programName : "",
          courseId: courseMap.courseId,
          courseAbreviation: courseData.courseAbreviation,
          courseTitle: courseData.courseTitle,
          courseFullTitle: courseData
            ? `${courseData.courseAbreviation} - ${courseData.courseTitle}`
            : "",
          teacherId: courseMap.teacherId,
          teacherFullName: teacherData ? teacherData.name : "",
          sectionId: courseMap.sectionId,
          sectionName: sectionData ? sectionData.sectionName : "",
          currentStatus: courseMap.currentStatus,
          totalStudents: studentsData.length,
          studentsData: studentsData,
        };
      })
    );

    res.send({
      entry: finalData,
      total: finalData.length,
    });
  } catch (err) {}
});

router.delete("/deleteCourseMap/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteCourseMap = await CourseMapping.findOneAndDelete({ _id: id });
    res.send(deleteCourseMap);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
module.exports = router;
