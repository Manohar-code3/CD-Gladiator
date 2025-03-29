from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
CORS(app)

# Configure file uploads
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'doc', 'docx'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Mock AI analysis (replace with actual OpenAI/Gemini API integration)
def analyze_resume(resume_path, job_description):
    return {
        "atsScore": 67,
        "skillsMatch": {"matched": 62, "missing": 38},
        "presentSkills": [
            "JavaScript", "React", "TypeScript", "HTML/CSS", "Git",
            "Responsive Design", "Problem Solving", "Communication",
            "Frontend", "CI/CD", "Project Management", "Testing"
        ],
        "missingSkills": [
            "Python", "Data Analysis", "Team Leadership",
            "Agile Methodology", "Cloud Computing", "Node.js",
            "Database Management", "RESTful APIs", "UI/UX Design"
        ]
    }

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'resume' not in request.files or 'jobDescription' not in request.form:
        return jsonify({"error": "Missing resume or job description"}), 400

    resume = request.files['resume']
    job_description = request.form['jobDescription']

    if resume.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if resume and allowed_file(resume.filename):
        filename = secure_filename(resume.filename)
        if not os.path.exists(app.config['UPLOAD_FOLDER']):
            os.makedirs(app.config['UPLOAD_FOLDER'])
        resume_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        resume.save(resume_path)

        # Analyze the resume
        analysis = analyze_resume(resume_path, job_description)
        
        # Optional: Clean up the uploaded file
        # os.remove(resume_path)
        
        return jsonify(analysis)
    else:
        return jsonify({"error": "File type not allowed"}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)