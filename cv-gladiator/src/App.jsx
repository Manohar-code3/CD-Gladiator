import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value);
  };

  const handleAnalyze = async () => {
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await axios.post("http://localhost:5000/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAnalysis(response.data);
    } catch (error) {
      console.error("Error analyzing resume:", error);
    }
  };

  return (
    <div className="app-container">
      <h1>CV Gladiator</h1>
      <p>AI-powered resume analysis to help you stand out and get hired</p>

      {/* Upload Section */}
      <div className="upload-section">
        <div className="upload-box">
          <h2>Upload Your Resume</h2>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        <div className="upload-box">
          <h2>Enter Job Description</h2>
          <textarea
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            placeholder="Paste the job description here to compare with your resume..."
            className="textarea"
          />
        </div>
      </div>

      <button onClick={handleAnalyze} className="analyze-button">
        Analyze Resume
      </button>

      {/* Analysis Results */}
      {analysis && (
        <div className="analysis-section">
          <div className="analysis-box">
            <h2>ATS Score</h2>
            <p>{analysis.atsScore}%</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${analysis.atsScore}%` }}
              ></div>
            </div>
          </div>

          <div className="analysis-box">
            <h2>Skills Match</h2>
            <p>Matched: {analysis.skillsMatch.matched}%</p>
            <p>Missing: {analysis.skillsMatch.missing}%</p>
          </div>

          <div className="analysis-box">
            <h2>Present Skills</h2>
            <ul>
              {analysis.presentSkills.map((skill, index) => (
                <li key={index} className="skill-present">
                  ✅ {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="analysis-box">
            <h2>Missing Skills</h2>
            <ul>
              {analysis.missingSkills.map((skill, index) => (
                <li key={index} className="skill-missing">
                  ❌ {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;