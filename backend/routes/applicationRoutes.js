const express = require("express");
const router = express.Router();

const {
  getApplications,
  getApplicationById
} = require("../controllers/applicationController");

router.get("/", getApplications);

router.get("/:applicationId", getApplicationById);

module.exports = router;