const express = require("express");
const Batch = require("../models/batches.model");
const Section = require("../models/sections.model");
const CourseMapping = require("../models/Mapping/courseMappings.model");
const Course = require("../models/courses.model");
const router = express.Router();

router.use(express.json());

// POST /login - user login
router.post("/addBatch", async (req, res) => {
  console.log("reqqqqqq", req.body);

  const { batchName, programName, sectionA, sectionB, sectionC } = req.body;

  const batchExists = await Batch.findOne({ batchName, programName });

  if (batchExists) {
    return res
      .status(422)
      .json({ error: "A Batch is already registered with this Name" });
  }

  const batch = new Batch({
    batchName,
    programName,
  });

  await batch.save();

  const getBatch = await Batch.findOne({ batchName, programName });

  const sectionAData = new Section({
    sectionName: "A",
    batchId: getBatch._id,
  });
  await sectionAData.save();

  if (sectionB) {
    const sectionBData = new Section({
      sectionName: "B",
      batchId: getBatch._id,
    });
    await sectionBData.save();
  }
  if (sectionC) {
    const sectionCData = new Section({
      sectionName: "C",
      batchId: getBatch._id,
    });
    await sectionCData.save();
  }
  res.status(200).json("New Batch Registered Successfully");
});

router.put("/updateBatch/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const options = { new: true };
    const updatedBatch = await Batch.findOneAndUpdate(
      { _id: id },
      update,
      options
    );
    res.send(updatedBatch);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/listAllBatches", async (req, res) => {
  Batch.find()
    .then((data) =>
      res.send({
        entry: data,
        total: data.length,
      })
    )
    .catch((err) => console.log(err));
});
router.get("/listAllSectionsWithABatch/:id", async (req, res) => {
  try {
    const { id } = req.params;

    Section.find({ batchId: id })
      .then((data) =>
        res.send({
          entry: data,
          total: data.length,
        })
      )
      .catch((err) => console.log(err));
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
router.get("/listAllBatchesWithSection", async (req, res) => {
  let sectionsData = [];
  let finalData = [];
  Batch.find()
    .then((batchData) => {
      Section.find().then((sectionsData) => {
        batchData.map((batchItem) => {
          sectionsData.map((sectionItem) => {
            if (batchItem?._id.toString() === sectionItem?.batchId.toString()) {
              finalData.push({
                batchId: batchItem?._id,
                batchName: batchItem?.batchName,
                programName: batchItem?.programName,
                sectionId: sectionItem?._id,
                sectionName: sectionItem?.sectionName,
              });
            }
          });
        });
        res.status(200).send({
          entry: finalData,
        });
      });
    })
    .catch((err) => console.log(err));
});

router.delete("/deleteBatchWithSections/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Section.deleteMany({ batchId: id });
    await CourseMapping.deleteMany({ batchId: id });
    const deleteBatch = await Batch.findOneAndDelete({ _id: id });
    res.send(deleteBatch);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
router.delete("/deleteSection/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const rawData = req.body;
    console.log("rawwww", id);
    const batchId = rawData.batchId;
    const sectionId = rawData.sectionId;
    await Section.findOneAndDelete({ _id: sectionId });
    await CourseMapping.deleteMany({ sectionId: sectionId, batchId: batchId });
    res.send("Section Data Deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
router.get("/deleteAll", async (req, res) => {
  try {
    await Batch.deleteMany();
    await Section.deleteMany();
    res.send("Section Data Deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
module.exports = router;
