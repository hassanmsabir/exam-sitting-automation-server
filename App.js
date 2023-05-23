const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());

// Connect to MongoDB database
const connectDb = require("./db");

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(require("./controllers/users.controller")); //linking Auth routes
app.use(require("./controllers/addTeacher.controller")); //linking Auth routes
app.use(require("./controllers/courses.controller")); //linking Auth routes
app.use(require("./controllers/batches.controller")); //linking Auth routes
app.use(require("./controllers/courseMappings.controller")); //linking Auth routes
app.use(require("./controllers/students.controller")); //linking Auth routes
app.use(require("./controllers/examSetting.controller")); //linking Auth routes
app.use(require("./controllers/examHall.controller")); //linking Auth routes
app.use(require("./controllers/deleteAllData.controller"));

// Start server
connectDb().then(() => {
  app.listen(8000, () => {
    console.log("Server started on port 8000");
  });
});
