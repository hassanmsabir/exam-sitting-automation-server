const express = require("express");
const router = express.Router();
const Student = require("../models/students.model");
const Schedule = require("../models/exam-schedule.model");
const ExamHall = require("../models/examHall.model");
const Batch = require("../models/batches.model");
const Course = require("../models/courses.model");
const Section = require("../models/sections.model");
const User = require("../models/users.model");

// Define seating arrangement endpoint
router.post("/seating-arrangement", async (req, res) => {
  try {
    const { batchId, sectionId, numRows, numCols } = req.body;

    // Get all students for the specified class
    const students = await Student.find({ batchId, sectionId });
    const totalStudents = students.length;
    // Sort students by GPA in ascending order
    students.sort((a, b) => a.gpa - b.gpa);

    // Set number of rows and columns in the seating arrangement

    // Initialize seating array with all seats empty
    const seating = Array(numRows)
      .fill()
      .map(() => Array(numCols).fill(null));

    // Define helper function to check if a seat is available
    const isSeatAvailable = (row, col) => {
      // Check if seat is empty
      if (seating[row][col] === null) {
        // Check left and right sides of the seat
        if (
          (col === 0 || seating[row][col - 1] === null) &&
          (col === numCols - 1 || seating[row][col + 1] === null)
        ) {
          // Check up and down sides of the seat
          if (
            (row === 0 || seating[row - 1][col] === null) &&
            (row === numRows - 1 || seating[row + 1][col] === null)
          ) {
            return true;
          }
        }
      }
      return false;
    };

    // Seat students based on GPA
    let i = 0;
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        if (isSeatAvailable(row, col)) {
          seating[row][col] = students[i];
          i++;
          if (i === students.length) {
            // All students have been seated
            break;
          }
        }
      }
      if (i === students.length) {
        // All students have been seated
        break;
      }
    }

    // Return the seating arrangement
    res.json({ seating, totalStudents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});
router.post("/seating-arrangement-mylogic2", async (req, res) => {
  try {
    const {
      hallId,
      examDate,
      examTime,
      batchId,
      sectionId,
      teacherId,
      courseId,
      examName,
    } = req.body;

    // exists({ classes: { $elemMatch: { batchId, sectionId } } });
    // const examDataExists = Schedule.find({ classesData: { $elemMatch: { batchId, sectionId } } })

    // const examDataExists = Schedule.find({ examDate, examTime, examHall });
    // if (examDataExists) {
    //   return;
    // }
    const hallData = await ExamHall.find({ _id: hallId });
    if (hallData.length === 0) {
      return res.status(422).json("The Provided Exam Hall is not Available");
    }
    const numRows = hallData[0].numRows;
    const numCols = hallData[0].numCols;
    let totalStudents = 0;

    const students = await Student.find({
      batchId: batchId,
      sectionId: sectionId,
    });
    totalStudents = totalStudents + students.length;

    const totalSeats = numRows * numCols;
    // let studentClassScore =
    //   (thisGpa / 50) * 34 +
    //   (thisTeacherReview / 5) * 33 +
    //   (hasCheated ? 0 : 33);
    if (totalStudents > totalSeats) {
      res.status(422).json("This room does not have enough seats");
      return;
    }

    const examScheduleExists = await Schedule.find({
      examDate,
      examTime,
      hallId,
    });
    if (examScheduleExists.length > 0) {
      // logic for second class
      let seating = JSON.parse(
        JSON.stringify(examScheduleExists[0].seatingArrangement)
      );
      // Sort students by GPA in ascending order
      students.sort((a, b) => a.gpa - b.gpa);
      // Sort students by Teacher's Review in Descending order
      students.sort(
        (a, b) => parseInt(b.teacherReview) - parseInt(a.teacherReview)
      );
      // Sort students by cheating History in Descending order
      students.sort((a, b) => b.cheatingHistory - a.cheatingHistory);

      let emptySeats = 0;
      examScheduleExists[0]?.seatingArrangement?.map((rowItem) => {
        rowItem.map((colItem) => {
          if (!colItem) {
            emptySeats = emptySeats + 1;
          }
        });
      });

      if (emptySeats > students.length) {
        if (true) {
          // Define helper function to check if a seat is available
          const isSeatAvailable = (row, col, thisStudent) => {
            // Check if seat is empty
            if (seating[row][col] === null) {
              // Check left and right sides of the seat

              if (
                (col === 0 ||
                  seating[row][col - 1] === null ||
                  seating[row][col - 1].sectionId.toString() !==
                    thisStudent.sectionId.toString()) &&
                (col === numCols - 1 ||
                  seating[row][col + 1] === null ||
                  seating[row][col + 1].sectionId.toString() !==
                    thisStudent.sectionId.toString())
              ) {
                // Check up and down sides of the seat
                if (
                  (row === 0 ||
                    seating[row - 1][col] === null ||
                    seating[row - 1][col].sectionId.toString() !==
                      thisStudent.sectionId.toString()) &&
                  (row === numRows - 1 ||
                    seating[row + 1][col] === null ||
                    seating[row + 1][col].sectionId.toString() !==
                      thisStudent.sectionId.toString())
                ) {
                  return true;
                }
              }
            }
            return false;
          };

          // Seat students based on GPA
          let i = 0;
          for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
              console.log("Seating[" + row + "][" + col + "]");
              if (isSeatAvailable(row, col, students[i])) {
                seating[row][col] = students[i];
                i++;
                if (i === students.length) {
                  // All students have been seated
                  break;
                }
              }
            }
            if (i === students.length) {
              // All students have been seated
              break;
            }
          }
        } else {
          let extraSeats = totalSeats - totalStudents;
          const isSeatAvailable = (row, col) => {
            // Check if seat is empty
            if (seating[row][col] === null) {
              // Check left and right sides of the seat

              if (extraSeats > 0) {
                if (
                  (col === 0 || seating[row][col - 1] === null) &&
                  (col === numCols - 1 || seating[row][col + 1] === null)
                ) {
                  // Check up and down sides of the seat
                  if (
                    (row === 0 || seating[row - 1][col] === null) &&
                    (row === numRows - 1 || seating[row + 1][col] === null)
                  ) {
                    extraSeats = extraSeats - 1;
                    return true;
                  }
                }
              } else {
                return true;
              }
            }
            return false;
          };

          // Seat students based on GPA
          let i = 0;
          for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
              if (isSeatAvailable(row, col)) {
                seating[row][col] = students[i];
                i++;
                if (i === students.length) {
                  // All students have been seated
                  break;
                }
              }
            }
            if (i === students.length) {
              // All students have been seated
              break;
            }
          }
        }
        const options = { new: true };

        await Schedule.findOneAndUpdate(
          {
            _id: examScheduleExists[0]._id,
          },
          {
            examDate,
            examTime,
            hallId,
            examName,
            classesData: examScheduleExists[0].classesData.concat([
              {
                batchId,
                sectionId,
                teacherId,
                courseId,
              },
            ]),
            seatingArrangement: seating,
            totalStudents: totalStudents,
          },
          options
        );

        return res.status(200).json({
          message: "Exam Scheduled With 2nd Class",
          seating: seating,
          total: examScheduleExists.length,
        });
      } else {
        return res.status(422).json({
          message:
            "This hall is already Booked and does not have enough seats.",
          seating: seating,
          total: examScheduleExists.length,
        });
      }
    } else {
      const seating = Array(numRows)
        .fill()
        .map(() => Array(numCols).fill(null));

      // Sort students by GPA in ascending order
      students.sort((a, b) => a.gpa - b.gpa);
      // Sort students by Teacher's Review in Descending order
      students.sort(
        (a, b) => parseInt(b.teacherReview) - parseInt(a.teacherReview)
      );
      // Sort students by cheating History in Descending order
      students.sort((a, b) => b.cheatingHistory - a.cheatingHistory);
      // Set number of rows and columns in the seating arrangement

      // Initialize seating array with all seats empty

      if (totalSeats / 2 >= totalStudents) {
        // Define helper function to check if a seat is available
        const isSeatAvailable = (row, col, thisStudent) => {
          // Check if seat is empty
          if (seating[row][col] === null) {
            // Check left and right sides of the seat
            if (
              (col === 0 || seating[row][col - 1] === null) &&
              (col === numCols - 1 || seating[row][col + 1] === null)
            ) {
              // Check up and down sides of the seat
              if (
                (row === 0 || seating[row - 1][col] === null) &&
                (row === numRows - 1 || seating[row + 1][col] === null)
              ) {
                return true;
              }
            }
          }
          return false;
        };

        // Seat students based on GPA
        let i = 0;
        for (let row = 0; row < numRows; row++) {
          for (let col = 0; col < numCols; col++) {
            if (isSeatAvailable(row, col, students[i])) {
              seating[row][col] = students[i];
              i++;
              if (i === students.length) {
                // All students have been seated
                break;
              }
            }
          }
          if (i === students.length) {
            // All students have been seated
            break;
          }
        }
      } else {
        let extraSeats = totalSeats - totalStudents;
        const isSeatAvailable = (row, col) => {
          // Check if seat is empty
          if (seating[row][col] === null) {
            // Check left and right sides of the seat

            if (extraSeats > 0) {
              if (
                (col === 0 || seating[row][col - 1] === null) &&
                (col === numCols - 1 || seating[row][col + 1] === null)
              ) {
                // Check up and down sides of the seat
                if (
                  (row === 0 || seating[row - 1][col] === null) &&
                  (row === numRows - 1 || seating[row + 1][col] === null)
                ) {
                  extraSeats = extraSeats - 1;
                  return true;
                }
              }
            } else {
              return true;
            }
          }
          return false;
        };

        // Seat students based on GPA
        let i = 0;
        for (let row = 0; row < numRows; row++) {
          for (let col = 0; col < numCols; col++) {
            if (isSeatAvailable(row, col)) {
              seating[row][col] = students[i];
              i++;
              if (i === students.length) {
                // All students have been seated
                break;
              }
            }
          }
          if (i === students.length) {
            // All students have been seated
            break;
          }
        }
      }

      // Return the seating arrangement
      const newData = new Schedule({
        examDate,
        examTime,
        hallId,
        examName,
        classesData: [
          {
            batchId,
            sectionId,
            teacherId,
            courseId,
          },
        ],
        seatingArrangement: seating,
        totalStudents: totalStudents,
      });
      const savedExamHall = await newData.save();
      res.json({
        message: "Seating Arrangement Saved",
        seating,
        totalStudents,
        savedExamHall,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});
router.get("/list-all-seating-arrangement", async (req, res) => {
  try {
    const data = await Schedule.find();
    if (data.length > 0) {
      const finalData = await Promise.all(
        data.map(async (item) => {
          const hallData = await ExamHall.findById(item.hallId);
          const classDataArr = await Promise.all(
            item.classesData.map(async (classData) => {
              const batchData = await Batch.findById(classData.batchId);
              const courseData = await Course.findById(classData.courseId);
              const sectionData = await Section.findById(classData.sectionId);
              const teacherData = await User.findById(classData.teacherId);
              return {
                batchId: classData.batchId,
                batchName: `${batchData?.batchName} - ${sectionData?.sectionName}`,
                programName: `${batchData?.programName} - ${sectionData?.programName}`,
                sectionId: classData.sectionId,
                courseId: classData.courseId,
                courseName: `${courseData?.courseAbreviation} - ${courseData?.courseTitle}`,
                teacherId: classData.teacherId,
                teacherName: `${teacherData?.title} ${teacherData?.firstName} ${teacherData?.lastName}`,
              };
            })
          );
          return {
            classesData: classDataArr,
            examName: item.examName,
            examDate: item.examDate,
            examTime: item.examTime,
            hallId: item.hallId,
            hallName: hallData?.hallName,
            seatingArrangement: item.seatingArrangement,
          };
        })
      );
      res.status(200).send({
        entry: finalData,
        total: finalData.length,
      });
    } else {
      res.status(422).json("No exam scheduled");
    }
  } catch (err) {
    res.status(400).json("Error Occurred");
  }
});
router.post("/seating-arrangement-mylogic", async (req, res) => {
  try {
    const { numRows, numCols, examHall, examName, classesData } = req.body;
    // classesData = [
    //   {
    //     batchId, sectionId, courseId
    //   }
    // ]
    // Get all students for the specified class
    let allClasses = [];
    let totalStudents = 0;
    await Promise.all(
      classesData.map(async (classData, index) => {
        const students = await Student.find({
          batchId: classData?.batchId,
          sectionId: classData?.sectionId,
        });
        totalStudents = totalStudents + students.length;
        allClasses.push(students);
      })
    );

    const totalSeats = numRows * numCols;
    numRows * numCols;
    if (totalStudents > totalSeats) {
      res.status(422).json("This room does not have enough seats");
      return;
    }
    const seating = Array(numRows)
      .fill()
      .map(() => Array(numCols).fill(null));

    allClasses.map((students, classIndex) => {
      // Sort students by GPA in ascending order
      students.sort((a, b) => a.gpa - b.gpa);
      // Sort students by Teacher's Review in Descending order
      students.sort(
        (a, b) => parseInt(b.teacherReview) - parseInt(a.teacherReview)
      );
      // Sort students by cheating History in Descending order
      students.sort((a, b) => b.cheatingHistory - a.cheatingHistory);
      // Set number of rows and columns in the seating arrangement

      // Initialize seating array with all seats empty

      if (totalSeats / 2 >= totalStudents) {
        // Define helper function to check if a seat is available
        const isSeatAvailable = (row, col, thisStudent) => {
          // Check if seat is empty
          if (seating[row][col] === null) {
            // Check left and right sides of the seat
            if (classIndex === 0) {
              if (
                (col === 0 || seating[row][col - 1] === null) &&
                (col === numCols - 1 || seating[row][col + 1] === null)
              ) {
                // Check up and down sides of the seat
                if (
                  (row === 0 || seating[row - 1][col] === null) &&
                  (row === numRows - 1 || seating[row + 1][col] === null)
                ) {
                  return true;
                }
              }
            } else {
              if (
                (col === 0 ||
                  seating[row][col - 1] === null ||
                  (seating[row][col - 1]?.batchId !== thisStudent?.batchId &&
                    seating[row][col - 1]?.sectionId !==
                      thisStudent?.sectionId)) &&
                (col === numCols - 1 ||
                  seating[row][col + 1] === null ||
                  (seating[row][col + 1]?.batchId !== thisStudent?.batchId &&
                    seating[row][col + 1]?.sectionId !==
                      thisStudent?.sectionId))
              ) {
                return true;
              }
            }
          }
          return false;
        };

        // Seat students based on GPA
        let i = 0;
        for (let row = 0; row < numRows; row++) {
          for (let col = 0; col < numCols; col++) {
            if (isSeatAvailable(row, col, students[i])) {
              seating[row][col] = students[i];
              i++;
              if (i === students.length) {
                // All students have been seated
                break;
              }
            }
          }
          if (i === students.length) {
            // All students have been seated
            break;
          }
        }
      } else {
        let extraSeats = totalSeats - totalStudents;
        const isSeatAvailable = (row, col) => {
          // Check if seat is empty
          if (seating[row][col] === null) {
            // Check left and right sides of the seat

            if (extraSeats > 0) {
              if (
                (col === 0 || seating[row][col - 1] === null) &&
                (col === numCols - 1 || seating[row][col + 1] === null)
              ) {
                // Check up and down sides of the seat
                if (
                  (row === 0 || seating[row - 1][col] === null) &&
                  (row === numRows - 1 || seating[row + 1][col] === null)
                ) {
                  extraSeats = extraSeats - 1;
                  return true;
                }
              }
            } else {
              return true;
            }
          }
          return false;
        };

        // Seat students based on GPA
        let i = 0;
        for (let row = 0; row < numRows; row++) {
          for (let col = 0; col < numCols; col++) {
            if (isSeatAvailable(row, col)) {
              seating[row][col] = students[i];
              i++;
              if (i === students.length) {
                // All students have been seated
                break;
              }
            }
          }
          if (i === students.length) {
            // All students have been seated
            break;
          }
        }
      }
    });

    // Return the seating arrangement
    res.json({ seating, totalStudents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
