# Full-Stack Web Development for AI Application

## Air Quality and Health

### Group 88 – JJ
**Tutor’s Name:** Hao Zhang  
**Students:**  
- **Teo Jia En** (102777416)  
- **Jayne Wong Hieng Siew** (102776536)  

---

## Project Overview
This project integrates machine learning models with a full-stack web application to help users visualize and understand air quality and health-related data. Users can explore AI-driven insights via a user-friendly interface and submit their health data for personalized predictions and recommendations.

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Front-End Implementation](#front-end-implementation)
4. [Back-End Implementation](#back-end-implementation)
5. [AI Model Integration](#ai-model-integration)
6. [Installation and Setup](#installation-and-setup)
7. [Usage](#usage)
8. [Troubleshooting](#troubleshooting)
9. [License](#license)
10. [Acknowledgments](#acknowledgments)

---

## System Architecture
The application follows a three-layer architecture:
- **Front-End:** Built with React.js to handle user interface and data visualizations.
- **Back-End:** FastAPI manages API endpoints, processes user data, and runs the AI models.
- **AI Model:** Trained models for predictions are integrated on the server side for air quality and health insights.

---

## Front-End Implementation
- Developed with **React.js** to ensure responsiveness and usability.
- Form validation ensures data accuracy and consistency.
- Visualization tools like **Chart.js** and **Plotly.js** display air quality trends.
- The front end communicates with back-end API endpoints to fetch predictions and submit user health reports.

---

## Back-End Implementation
- **FastAPI** processes API requests, handles data submissions, and runs AI models for health and air quality predictions.
- Endpoints include:
  - `/api/healthReport` for handling health reports
  - `/api/predict` for generating predictions
- Error handling ensures reliable user feedback and validation of input data.

---

## AI Model Integration
- Trained models (`aq_health_regression.pkl`, `aq_weather_regression.pkl`) from Assignment 2 are used for predictions.
- Data preprocessing scripts in the backend prepare inputs for the models, ensuring smooth integration between user inputs and AI model outputs.

---

## Structured Project Directory
```
frontend/
│── public/
│   │── images/
│   │   ├── carpooling.jpg
│   │   ├── cleanup.jpg
│   │   ├── ecofriendly.jpg
│   │   ├── heroimage.jpg
│   │   ├── houseplant.jpg
│   │   ├── impactgraph.jpg
│   │   ├── impactgraph1.jpg
│   │   ├── impactgraph2.jpg
│   │   ├── impactgraph3.jpg
│   │   ├── impactgraph4.jpg
│   │   ├── logo.png
│   │   ├── medical-team.jpg
│── src/
│── App.js
│── components/
│   │── AQI/
│   │   ├── AQI.js
│   │   ├── AirQualityTrendsChart.js
│   │   ├── AQIChart.js
│   │── Footer/
│   │   ├── ContactDialog.js
│   │   ├── Footer.js
backend/
│── data/
│   │── aqhealth_merged.csv
│   │── aqhealth_merged_cleaned.csv
│   │── merged_weather_air_quality_cleaned_renamed.csv
│── models/
│   │── aq_health_regression.pkl
│   │── aq_weather_regression.pkl
│   │── scaler_health.pkl
│   │── scaler_weather.pkl
│── utils/
│   │── air_quality_health_classification.py
│   │── air_quality_health_regression.py
│── main.py
README.md
```

---

## Installation and Setup

### 1. Model Training and Preparation
If you need to retrain the AI models, run the provided training scripts:
```bash
cd backend/utils
python air_quality_health_regression.py
python air_quality_weather_regression.py
```
Ensure the trained models are saved in the `backend/models/` directory.

### 2. Front-End Setup
Follow these steps to install and run the front-end React application:
```bash
cd frontend
```
Install necessary libraries:
```bash
npm install @mui/material @emotion/react @emotion/styled axios chart.js \
plotly.js-dist react-leaflet leaflet react-router-dom @mui/icons-material
```
Start the React application:
```bash
npm start
```
This will launch the front end at `http://localhost:3000`.

### 3. Back-End Setup
To set up the back end, activate the Python virtual environment and install dependencies.

For **Windows**:
```bash
cd backend
python -m venv new_venv
new_venv\Scripts\activate
```
For **Mac/Linux**:
```bash
python3 -m venv new_venv
source new_venv/bin/activate
```
Install required Python libraries:
```bash
pip install fastapi uvicorn pydantic joblib pandas numpy scikit-learn email-validator
```
Start the FastAPI server:
```bash
uvicorn main:app --reload
```
The API documentation is available at `http://localhost:8000/docs`.

---

## Usage
1. Open a browser and go to `http://localhost:3000` to interact with the front-end interface.
2. Submit health data through the input forms.
3. The back-end server will process your input and return predictions, which are visualized in charts and trend analysis.

---

## Troubleshooting
- If the server fails to start, ensure all dependencies are installed correctly in the virtual environment.
- Check the FastAPI logs for detailed error messages.
- For front-end issues, inspect the browser console for errors related to missing dependencies.

---

## License
This project is licensed under **Swinburne University of Technology**.

---

## Acknowledgments
This project was completed as part of **Assignment 3** in the **COS30049 Computing Technology Innovation Project** course.
