const {
  getStudents,
  addStudent,
  deleteStudent,
} = require("../controllers/dash_Controller.js");
const express = require("express");
const router1 = express.Router();

router1.get("/students", getStudents);
router1.post("/addStudent", addStudent);
router1.delete("/delStudents/:id", deleteStudent);

module.exports = router1;
