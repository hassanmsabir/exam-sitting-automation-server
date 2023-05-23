const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define user schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  username: String,
  role: String,
  name: String,
  firstName: String,
  lastName: String,
  gender: String,
  title: String,
});

// Create user model
const User = mongoose.model("User", userSchema, "registered_users");
module.exports = User;
