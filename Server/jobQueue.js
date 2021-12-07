const Queue = require("bull");
const jobQueue = new Queue("job-runner-queue");
const NUM_WORKERS = 5;
const Job = require("./models/Job");
const { executeCpp } = require("./executeCpp");
const { executePy } = require("./executePy");
jobQueue.process(NUM_WORKERS, async ({ data }) => {
  const jobId = data.id;
  const job = await Job.findById(jobId);
  if (job === undefined) {
    throw Error(`cannot find Job with id ${jobId}`);
  }
  try {
    let output;
    job["startedAt"] = new Date();
    // console.log(job.filepath);

    console.log("Error: ", job);
    if (job.language === "cpp") {
      output = await executeCpp(job.codeFilePath, job.inputFilePath);
    } else if (job.language === "py") {
      output = await executePy(job.codeFilePath, job.inputFilePath);
    }
    job["completedAt"] = new Date();
    job["status"] = "Success";
    job["output"] = output;
    await job.save();
    return true;
  } catch (err) {
    job["completedAt"] = new Date();
    job["status"] = "Error";
    job["output"] = JSON.stringify(err);
    await job.save();
    throw Error(JSON.stringify(err));
  }
});
jobQueue.on("failed", (error) => {
  console.log(error.data.id, "failed", error.failedReason);
});
const addJobToQueue = async (jobId) => {
  jobQueue.add({ id: jobId });
};
module.exports = {
  addJobToQueue,
};
