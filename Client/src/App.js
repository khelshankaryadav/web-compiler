import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import stubs from "./defaultStubs";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, NavDropdown } from "react-bootstrap";
function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [output, setOuput] = useState("");
  const [status, setStatus] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [jobDetails, setjobDetails] = useState(null);
  const [inputFile, setInputFile] = useState("");
  useEffect(() => {
    setCode(stubs[language]);
  }, [language]);
  useEffect(() => {
    const defaultLang = localStorage.getItem("default-language") || "cpp";
    setLanguage(defaultLang);
  }, []);

  const setDefaultLanguage = () => {
    localStorage.setItem("default-language", language);
    console.log(`${language}set as default language`);
  };
  const renderTimeDetails = () => {
    if (!jobDetails) {
      return "";
    }
    let result = "";
    let { submittedAt, completedAt, startedAt } = jobDetails;
    submittedAt = moment(submittedAt).toString();
    result += `Submitted At:${submittedAt}`;
    if (!completedAt || !startedAt) {
      return result;
    }
    const start = moment(startedAt);
    const end = moment(completedAt);
    const executionTime = end.diff(start, "seconds", true);
    result += `Execution Time: ${executionTime}s`;
    return result;
  };
  let intervalId;
  const handleRun = async () => {
    const payload = {
      language,
      code,
      inputFile,
    };
    try {
      setJobId(null);
      setStatus(null);
      setOuput("");
      setjobDetails(null);
      const { data } = await axios.post("http://localhost:5000/run", payload);
      if (data.jobId) {
        setJobId(data.jobId);
        intervalId = setInterval(async () => {
          const { data: dataRes } = await axios.get(
            "http://localhost:5000/status",
            { params: { id: data.jobId } }
          );
          const { success, job, error } = dataRes;
          console.log(dataRes);
          if (success) {
            const { status: jobStatus, output: jobOutput } = job;
            setStatus(jobStatus);
            setjobDetails(job);
            if (jobStatus === "Pending") return;
            setOuput(jobOutput);
            clearInterval(intervalId);
          } else {
            console.error(error);
            setStatus("Bad request");
            setOuput(error);
            clearInterval(intervalId);
          }
        }, 1000);
      } else {
        setOuput("Retry again.");
      }
    } catch ({ response }) {
      if (response) {
        const errMsg = response.data.err.stderr;
        setOuput(errMsg);
      } else {
        setOuput("Please retry submitting.");
      }
    }
  };
  return (
    <div className="App">
      <div>
        <Navbar bg="dark" expand="lg">
          <Navbar.Brand href="/" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
            Web Compiler
          </Navbar.Brand>
          <NavDropdown title="Python" id="basic-nav-dropdown">
            <NavDropdown.Item
              href="https://www.python.org/doc/"
              target="_blank"
            >
              Doc
            </NavDropdown.Item>

            <NavDropdown.Item
              href="https://www.udemy.com/course/100-days-of-code/"
              target="_blank"
            >
              MOOC
            </NavDropdown.Item>
            <NavDropdown.Item
              href="https://youtube.com/playlist?list=PLu0W_9lII9agICnT8t4iYVSZ3eykIAOME"
              target="_blank"
            >
              Playlist
            </NavDropdown.Item>
            <NavDropdown.Item
              href="https://www.hackerrank.com/domains/python"
              target="_blank"
            >
              Practice
            </NavDropdown.Item>
            <NavDropdown.Item
              href="https://www.javatpoint.com/python-tutorial"
              target="_blank"
            >
              Tutorial
            </NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="C++" id="basic-nav-dropdown">
            <NavDropdown.Item
              href="https://docs.microsoft.com/en-us/cpp/?view=msvc-170"
              target="_blank"
            >
              Doc
            </NavDropdown.Item>

            <NavDropdown.Item
              href="https://www.youtube.com/playlist?list=PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL"
              target="_blank"
            >
              Playlist
            </NavDropdown.Item>
            <NavDropdown.Item
              href="https://www.hackerrank.com/domains/cpp"
              target="_blank"
            >
              Practice
            </NavDropdown.Item>
            <NavDropdown.Item
              href="https://www.javatpoint.com/cpp-tutorial"
              target="_blank"
            >
              Tutorial
            </NavDropdown.Item>
          </NavDropdown>
        </Navbar>
      </div>
      <div>
        <br />
        <label>Language: &nbsp; </label>
        <select
          value={language}
          onChange={(e) => {
            const response = window.confirm(
              "Are you sure you want to change language? WARNING: Your current code will be lost."
            );
            if (response) {
              setLanguage(e.target.value);
            }
          }}
        >
          <option value="cpp">C++</option>
          <option value="py">Python</option>
        </select>
      </div>
      <br />
      <div>
        <button onClick={setDefaultLanguage}>Set Default</button>
      </div>
      <br />
      <div class="container">
        <div class="row">
          <div class="col">
            <span className="badge badge-info heading mt-2 ">
              <i className="fas fa-code fa-fw fa-lg"></i> Code Here
            </span>
            <textarea
              id="source"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
              }}
            ></textarea>
            <button onClick={handleRun}>Run</button>
          </div>
          <div class="col">
            <span className="badge badge-primary heading my-2 ">
              <i className="fas fa-user fa-fw fa-md"></i> User Input
            </span>
            <textarea
              id="input"
              onChange={(e) => setInputFile(e.target.value)}
            />
          </div>
        </div>
        <div class="container">
          <div class="row">
            <div class="mt-2 ml-5">
              <span className="badge badge-info heading my-2 ">
                <i className="fas fa-exclamation fa-fw fa-md"></i> Output
              </span>
              <p style={{ border: "solid" }}>
                <p>{status}</p>
                <p>{jobId ? `Job ID: ${jobId}` : ""}</p>
                <p>{renderTimeDetails}</p>
                <p>{output}</p>
              </p>
            </div>
          </div>
        </div>
      </div>
      <footer
        id="sticky-footer"
        class="flex-shrink-0 py-4 bg-dark text-white-50"
      >
        <div class="container text-center">
          <small>Copyright &copy; Web Compiler</small>
        </div>
      </footer>
    </div>
  );
}

export default App;
