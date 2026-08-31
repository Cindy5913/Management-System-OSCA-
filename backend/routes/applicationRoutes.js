const express = require("express");
const router = express.Router();

const {
  getApplications
} = require("../controllers/applicationController");

router.get("/", getApplications);

module.exports = router;