const express = require("express");
const User = require("../models/users.model");
const router = express.Router();

router.use(express.json());

// POST /login - user login
router.post("/addTeacher", async (req, res) => {
  console.log("reqqqqqq", req.body);

  const { title, firstName, lastName, gender, username, email, password } =
    req.body;

  const userEmailExists = await User.findOne({ email });
  const usernameExists = await User.findOne({ username });

  if (userEmailExists) {
    return res
      .status(422)
      .json({ error: "A Teacher already registered with this email address" });
  }
  if (usernameExists) {
    return res
      .status(422)
      .json({ error: "A Teacher already registered with this Username" });
  }
  const user = new User({
    username,
    name: `${title} ${firstName} ${lastName}`,
    gender,
    email,
    password,
    role: "teacher",
    title,
    firstName,
    lastName,
  });

  await user.save();
  res.status(200).json("New teacher Registered Successfully");
});

router.put("/updateTeacherData/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const options = { new: true };
    const updatedTeacherData = await User.findOneAndUpdate(
      { _id: id },
      update,
      options
    );
    res.send(updatedTeacherData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.delete("/deleteTeacherData/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTeacherData = await User.findOneAndDelete({ _id: id });
    res.send(deleteTeacherData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/listTeachers", async (req, res) => {
  User.find({ role: "teacher" })
    .then((data) =>
      res.send({
        entry: data,
        total: data.length,
      })
    )
    .catch((err) => console.log(err));
});

module.exports = router;
