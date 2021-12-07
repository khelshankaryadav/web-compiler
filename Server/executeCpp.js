const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}
const executeCpp = (filepath, inputpath) => {
  /*
   * @params
   * input:
   *   filepath: excutable path
   *   inputpath: input to excultable file path
   **/
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);
  return new Promise((resolve, reject) => {
    exec(
      // `g++ ${filepath} -o ${outPath} && cd ${outputPath} && ${jobId}.out`,
      // TODO: once input is done in frontend replace above line with ->
      `g++ ${filepath} -o ${outPath} && cd ${outputPath} && ${jobId}.out < ${inputpath}`,
      (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
      }
    );
  });
};
module.exports = {
  executeCpp,
};
