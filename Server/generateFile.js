const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const dirCodes = path.join(__dirname, "codes");
const inputDir = path.join(__dirname, "inputs");

// put this in input handler
// const dirInput = path.join(__dirname, "inputs");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}
const generateFile = async (format, content, inputContent) => {
  const jobId = uuid();
  const filename = `${jobId}.${format}`;
  const filepath = path.join(dirCodes, filename);

  // put this in input handler
  // better approch create a controller to return uuid and pass same uuid to both code and input handler
  // or rather than different controller use the same function and use the multi part array to get the code and input data.
  // else encode the input to base64 or binary and send it as request body and then decode and parse resp.
  // const inputName = `${jobId}.txt`;
  // const inputpath = path.join(dirInput, inputName);
  // fs.writeFileSync(inputpath, content)
  fs.writeFileSync(filepath, content);

  try {
    const inputFilePath = await generateInputFile(inputContent, jobId);
    return {
      codeFilePath: filepath,
      inputFilePath: inputFilePath,
    };
  } catch {
    return {
      codeFilePath: filepath,
      inputFilePath: "",
    };
  }
};

const generateInputFile = async (content, uuid) => {
  const filepath = path.join(inputDir, `${uuid}.txt`);

  await fs.writeFileSync(filepath, content);
  return filepath;
};

module.exports = {
  generateFile,
};
