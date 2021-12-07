const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { generateFile } = require("./generateFile");
const Job = require("./models/Job");
const { JSON } = require("express");
const { addJobToQueue } = require("./jobQueue");
mongoose.connect(
  "mongodb://mongo:27017/compilerapp",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    err && console.error(err);
    console.log("Successfully connected to MongoDB: compilerdb");
  }
);
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = 5000;
app.post("/run", async (req, res) => {
  const { language = "cpp", code, inputFile } = req.body;

  console.log(language, "Length:", code.length);
  if (code === undefined) {
    return res.status(400).json({ sucess: false, error: "Empty code body!" });
  }

  const { codeFilePath, inputFilePath } = await generateFile(
    language,
    code,
    inputFile
  );
  console.log("file");
  const job = await new Job({ language, codeFilePath, inputFilePath }).save();
  const jobId = job["_id"];
  addJobToQueue(jobId);
  res.status(201).json({ jobId });
});
app.get("/status", async (req, res) => {
  const jobId = req.query.id;
  console.log("status requested", jobId);
  if (jobId === undefined) {
    return res
      .status(400)
      .json({ success: false, error: "missing id query param" });
  }
  const job = await Job.findById(jobId);
  if (job === undefined) {
    return res.status(400).json({ success: false, error: "couldn't find job" });
  }
  return res.status(200).json({ success: true, job });
});
app.listen(port, () => {
  console.log(`Server Started on Port ${port}`);
});
