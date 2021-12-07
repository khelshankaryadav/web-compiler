const mongoose = require("mongoose");
const JobSchema = mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ["cpp", "py"],
  },
  codeFilePath: {
    type: String,
    required: true,
  },
  inputFilePath: {
    type: String,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  startedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  output: {
    type: String,
  },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Success", "Error"],
  },
});
module.exports = mongoose.model("job", JobSchema);
