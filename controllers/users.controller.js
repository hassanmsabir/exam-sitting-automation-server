const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users.model");
const router = express.Router();

router.use(express.json());

// POST /login - user login
router.post("/login", async (req, res) => {
  console.log("reqqqqqq", req.body);

  const { email, password } = req.body;

  // Find user in database
  const user = await User.findOne({ email });

  // If user not found, return error
  if (!user) {
    return res.status(401).json({ message: "Invalid email" });
  }

  // Check if password matches
  const isMatch = await bcrypt.compare(password, user.password);

  // If password doesn't match, return error
  if (password != user.password) {
    return res.status(401).json({ message: "Invalid password" });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, "my-secret-key");

  // Return response with token
  res
    .status(200)
    .json({
      token,
      fullname: user.name,
      role: user.role,
      username: user.username,
      userId: user._id,
    });
});

module.exports = router;
