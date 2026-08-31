const express = require("express");
const cors = require("cors");
require("dotenv").config();

const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/applications", applicationRoutes);

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Record Management System backend is running."
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});