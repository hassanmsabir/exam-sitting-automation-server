const express = require("express");
const Course = require("../models/courses.model");
const CourseMapping = require("../models/Mapping/courseMappings.model");
const router = express.Router();

router.use(express.json());

// POST /login - user login
router.post("/addCourse", async (req, res) => {
  console.log("reqqqqqq", req.body);

  const { courseCode, courseTitle, courseCreditHours, courseAbreviation } =
    req.body;

  const courseExists = await Course.findOne({ courseCode });

  if (courseExists) {
    return res
      .status(422)
      .json({ error: "A Course is already registered with this Course Code" });
  }

  const user = new Course({
    courseCode,
    courseTitle,
    courseCreditHours,
    courseAbreviation,
  });

  await user.save();
  res.status(200).json("New Course Registered Successfully");
});

router.put("/updateCourse/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const options = { new: true };
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: id },
      update,
      options
    );
    res.send(updatedCourse);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/listAllCourses", async (req, res) => {
  Course.find()
    .then((data) =>
      res.send({
        entry: data,
        total: data.length,
      })
    )
    .catch((err) => console.log(err));
});
router.post("/listAllCoursesOfBatchSection", async (req, res) => {
  let { batchId, sectionId } = req.body;
  let finalData = [];
  await CourseMapping.find({ batchId, sectionId }).then((courseMaps) => {
    // Use map to create an array of Promises returned by Course.findOne
    let promises = courseMaps.map((map) => {
      return Course.findOne({ _id: map.courseId })
        .then((data) => {
          finalData.push(data);
        })
        .catch((err) => console.log(err));
    });

    // Use Promise.all to wait for all Promises to resolve before sending the response
    Promise.all(promises).then(() => {
      console.log("finalData", finalData);

      res.send({
        entry: finalData,
        total: finalData.length,
      });
    });
  });
});

router.delete("/deleteCourse/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteCourse = await Course.findOneAndDelete({ _id: id });
    res.send(deleteCourse);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
module.exports = router;
