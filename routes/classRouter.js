const express = require("express");
const router = express.Router();

const classeeController = require("../controllers/classeeController");
//add class
router.post("/add", classeeController.createClass);
// Get all classes
router.get("/allclasses", classeeController.getClasses);

module.exports = router;
