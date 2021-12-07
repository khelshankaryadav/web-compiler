const { exec } = require("child_process");
const executePy = (filepath, inputpath) => {
  return new Promise((resolve, reject) => {
    // TODO: once input is done in frontend replace above line with ->
    // `python ${filepath}` < ${inputpath}\jobId.txt`,
    exec(`python ${filepath} < ${inputpath}`, (error, stdout, stderr) => {
      error && reject({ error, stderr });
      stderr && reject(stderr);
      resolve(stdout);
    });
  });
};
module.exports = {
  executePy,
};
