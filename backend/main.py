import joblib
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import logging

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the regression models
aq_health_model_data = joblib.load("C://Users//User//OneDrive//Desktop//COS30049 Computing Technology Innovation Project//Assignment 3//backend//models//aq_health_regression.pkl")
aq_weather_model_data = joblib.load("C://Users//User//OneDrive//Desktop//COS30049 Computing Technology Innovation Project//Assignment 3//backend//models//aq_weather_regression.pkl")
# Load scalers
scaler_health = joblib.load("C://Users//User//OneDrive//Desktop//COS30049 Computing Technology Innovation Project//Assignment 3//backend//models//scaler_health.pkl")
scaler_weather = joblib.load("C://Users//User//OneDrive//Desktop//COS30049 Computing Technology Innovation Project//Assignment 3//backend//models//scaler_weather.pkl")

# Extract the models from the loaded data
aq_health_model = aq_health_model_data[0] if isinstance(aq_health_model_data, tuple) else aq_health_model_data
aq_weather_model = aq_weather_model_data.get("model") if isinstance(aq_weather_model_data, dict) else aq_weather_model_data

# Load datasets for feature extraction
data_health = pd.read_csv("C://Users//User//OneDrive//Desktop//COS30049 Computing Technology Innovation Project//Assignment 3//backend//data//aqhealth_merged_cleaned.csv")
data_weather = pd.read_csv("C://Users//User//OneDrive//Desktop//COS30049 Computing Technology Innovation Project//Assignment 3//backend//data//merged_weather_air_quality_cleaned_renamed.csv")

# CustomAppBar.js
# API endpoint to predict AQI and Temperature on Navigation Bar
@app.post("/api/predict_aqi_temperature")
async def predict_aqi_temperature():
    try:
        # Print column names for debugging
        print("Weather Data Columns:", data_weather.columns.tolist())

        # Extract a random row for prediction
        random_row_health = data_health.sample()
        random_row_weather = data_weather.sample()

        # Prepare the features for the health model
        health_features = np.array([[random_row_health['London Mean Roadside:Nitrogen Dioxide (ug/m3)'].values[0],
                                      random_row_health['London Mean Roadside:PM10 Particulate (ug/m3)'].values[0],
                                      random_row_health['London Mean Roadside:PM2.5 Particulate (ug/m3)'].values[0],
                                      random_row_health['London Mean Roadside:Ozone (ug/m3)'].values[0],
                                      random_row_health['London Mean Roadside:Sulphur Dioxide (ug/m3)'].values[0],
                                      random_row_health['London Mean Background:Nitrogen Dioxide (ug/m3)'].values[0],
                                      random_row_health['London Mean Background:Ozone (ug/m3)'].values[0],
                                      random_row_health['London Mean Background:PM10 Particulate (ug/m3)'].values[0],
                                      random_row_health['London Mean Background:PM2.5 Particulate (ug/m3)'].values[0],
                                      random_row_health['London Mean Background:Sulphur Dioxide (ug/m3)'].values[0]]])

        # Prepare the features for the weather model
        weather_feature_names = [
            'mean_temp',
            'precipitation',
            'wspd',
            'pressure',
            'Roadside_Nitrogen_Dioxide (ug/m3)',
            'Roadside_Ozone (ug/m3)',
            'Roadside_PM10_Particulate (ug/m3)',
            'Roadside_PM2.5_Particulate (ug/m3)',
            'Background_Nitrogen_Dioxide (ug/m3)',
            'Background_Ozone (ug/m3)',
            'Background_PM10_Particulate (ug/m3)',
            'Background_PM2.5_Particulate (ug/m3)',
            'Background_Sulphur Dioxide (ug/m3)'  
        ]

        # Create a weather features array while handling missing columns
        weather_features = []
        for col in weather_feature_names:
            if col in random_row_weather.columns:
                weather_features.append(random_row_weather[col].values[0])
            else:
                print(f"Column missing: {col}")  # Print a message if a column is missing

        print(f"Extracted Weather Features: {weather_features}")  # Log the extracted features

        if len(weather_features) != 13:
            # Handle the case where Background Sulphur Dioxide is missing
            if 'Background_Sulphur Dioxide (ug/m3)' not in random_row_weather.columns:
                print("Background Sulphur Dioxide column is missing; proceeding with 12 features.")
                weather_features.append(0)  # Append a default value if the column is missing

        weather_features_array = np.array([weather_features]).reshape(1, -1)

        # Scale the features
        health_features_scaled = scaler_health.transform(health_features)
        weather_features_scaled = scaler_weather.transform(weather_features_array)

        # Make predictions
        predicted_aqi = aq_health_model.predict(health_features_scaled)
        predicted_temperature = aq_weather_model.predict(weather_features_scaled)

        # Debugging: Check the shapes of predictions
        print("Predicted AQI:", predicted_aqi, "Shape:", predicted_aqi.shape)
        print("Predicted Temperature:", predicted_temperature, "Shape:", predicted_temperature.shape)

        # Extract the first prediction value
        predicted_aqi_value = round(float(predicted_aqi[0][1]), 2) if predicted_aqi.size > 1 else None  # Use the second value
        predicted_temperature_value = round(float(predicted_temperature[0][0]), 2) if predicted_temperature.size > 0 else None  # Round to 2 decimals

        # Return the predictions
        return {
            'predicted_temperature': predicted_temperature_value,
            'predicted_aqi': predicted_aqi_value
        }

    except Exception as e:
        return {"error": str(e)}

# Health.js
class HourlyAQIPredictRequest(BaseModel):
    hours_ahead: int
    mean_temp: float
    precipitation: float
    wspd: float
    wdir: float
    pressure: float
    roadside_nitrogen_dioxide: float
    roadside_ozone: float
    roadside_pm10_particulate: float
    roadside_pm2_5_particulate: float
    background_nitrogen_dioxide: float
    background_ozone: float
    background_pm10_particulate: float
    background_pm2_5_particulate: float

@app.post("/api/predict_hourly_aqi/")
async def predict_hourly_aqi(request: HourlyAQIPredictRequest):
    try:
        # Prepare to store predictions
        hourly_aqi_predictions = []

        # Iterate through the next 24 hours
        for hour in range(24):
            # Sample a random row from the health data
            random_health_row = data_health.sample()

            # Extract features from the random health row
            health_features = np.array([[
                random_health_row['London Mean Roadside:Nitrogen Dioxide (ug/m3)'].values[0],
                random_health_row['London Mean Roadside:PM10 Particulate (ug/m3)'].values[0],
                random_health_row['London Mean Roadside:PM2.5 Particulate (ug/m3)'].values[0],
                random_health_row['London Mean Roadside:Ozone (ug/m3)'].values[0],
                random_health_row['London Mean Roadside:Sulphur Dioxide (ug/m3)'].values[0],
                random_health_row['London Mean Background:Nitrogen Dioxide (ug/m3)'].values[0],
                random_health_row['London Mean Background:Ozone (ug/m3)'].values[0],
                random_health_row['London Mean Background:PM10 Particulate (ug/m3)'].values[0],
                random_health_row['London Mean Background:PM2.5 Particulate (ug/m3)'].values[0],
                random_health_row['London Mean Background:Sulphur Dioxide (ug/m3)'].values[0]
            ]])

            # Adjust health features based on the hour
            # Example: Increment roadside PM2.5 as an artificial effect of time
            health_features[0][2] += hour * 0.5  # Increase PM2.5 by 0.5 ug/m3 per hour as a sample change

            # Scale the features and make the prediction
            health_features_scaled = scaler_health.transform(health_features)

            # Make the prediction for the current hour
            predicted_aqi = aq_health_model.predict(health_features_scaled)

            # Store the prediction
            hourly_aqi_predictions.append(predicted_aqi[0][1])  # Assuming the second value is the desired prediction

        # Return all predictions for the next 24 hours
        return {"hourly_aqi": hourly_aqi_predictions}

    except Exception as e:
        logging.error(f"Error during AQI prediction: {str(e)}")
        return {"error": "An internal server error occurred."}

# Health.js
class WeeklyTemperaturePredictRequest(BaseModel):
    days_ahead: int = 7

@app.post("/api/predict_weekly_temperature/")
async def predict_weekly_temperature(request: WeeklyTemperaturePredictRequest):
    try:
        weekly_temperatures = []

        for _ in range(request.days_ahead):
            random_weather_row = data_weather.sample()

            # Prepare features from random weather row (similar to your other predictions)
            weather_features = [
                random_weather_row['mean_temp'].values[0],
                random_weather_row['precipitation'].values[0],
                random_weather_row['wspd'].values[0],
                random_weather_row['pressure'].values[0],
                random_weather_row['Roadside_Nitrogen_Dioxide (ug/m3)'].values[0],
                random_weather_row['Roadside_Ozone (ug/m3)'].values[0],
                random_weather_row['Roadside_PM10_Particulate (ug/m3)'].values[0],
                random_weather_row['Roadside_PM2.5_Particulate (ug/m3)'].values[0],
                random_weather_row['Background_Nitrogen_Dioxide (ug/m3)'].values[0],
                random_weather_row['Background_Ozone (ug/m3)'].values[0],
                random_weather_row['Background_PM10_Particulate (ug/m3)'].values[0],
                random_weather_row['Background_PM2.5_Particulate (ug/m3)'].values[0],
                random_weather_row.get('Background_Sulphur Dioxide (ug/m3)', 0)  # Handle missing column
            ]

            weather_features_array = np.array([weather_features]).reshape(1, -1)
            weather_features_scaled = scaler_weather.transform(weather_features_array)

            predicted_temperature = aq_weather_model.predict(weather_features_scaled)
            weekly_temperatures.append(round(float(predicted_temperature[0][0]), 2))

        return {"weekly_temperatures": weekly_temperatures}

    except Exception as e:
        logging.error(f"Error during weekly temperature prediction: {str(e)}")
        return {"error": "An internal server error occurred."}

# HealthReportDialog.js
class HealthReport(BaseModel):
    firstName: str
    lastName: str
    age: int
    weight: float
    height: float
    gender: str
    contactNumber: str
    email: str
    conditions: list[str]
    symptoms: list[str]
    medications: list[str]
    smokingStatus: str
@app.post("/api/healthReport")
async def submit_health_report(report: HealthReport):
    # Process the report data
    # You can add code here to save it to a database or further process it
    return {"message": "Health report submitted successfully"}

# AQIChart.js
class WeeklyAQIPredictRequest(BaseModel):
    days_ahead: int = 7
    
@app.post("/api/predict_weekly_aqi/")
async def predict_weekly_aqi(request: WeeklyAQIPredictRequest):
    try:
        weekly_aqi_predictions = []

        for _ in range(request.days_ahead):
            random_health_row = data_health.sample()

            # Prepare features from random health row
            health_features = np.array([[  # Ensure you adjust indices to match your model
                random_health_row['London Mean Roadside:Nitrogen Dioxide (ug/m3)'].values[0],
                random_health_row['London Mean Roadside:PM10 Particulate (ug/m3)'].values[0],
                random_health_row['London Mean Roadside:PM2.5 Particulate (ug/m3)'].values[0],
                random_health_row['London Mean Roadside:Ozone (ug/m3)'].values[0],
                random_health_row['London Mean Roadside:Sulphur Dioxide (ug/m3)'].values[0],
                random_health_row['London Mean Background:Nitrogen Dioxide (ug/m3)'].values[0],
                random_health_row['London Mean Background:Ozone (ug/m3)'].values[0],
                random_health_row['London Mean Background:PM10 Particulate (ug/m3)'].values[0],
                random_health_row['London Mean Background:PM2.5 Particulate (ug/m3)'].values[0],
                random_health_row['London Mean Background:Sulphur Dioxide (ug/m3)'].values[0]
            ]])

            # Scale the features
            health_features_scaled = scaler_health.transform(health_features)

            # Make the prediction
            predicted_aqi = aq_health_model.predict(health_features_scaled)
            weekly_aqi_predictions.append(round(float(predicted_aqi[0][1]), 2)) 

        return {"weekly_aqi": weekly_aqi_predictions}

    except Exception as e:
        logging.error(f"Error during weekly AQI prediction: {str(e)}")
        return {"error": "An internal server error occurred."}

# AirQualityTrendsChart.js
@app.get("/api/air_quality_trends")
async def get_air_quality_trends():
    try:
        # Filter data for the years you want to include
        data_weather['date'] = pd.to_datetime(data_weather['date'], format='%Y-%m')
        
        # Extract month names and group by month to calculate average concentrations
        data_weather['month'] = data_weather['date'].dt.month_name()

        # Group by month and calculate average concentrations for each pollutant
        monthly_trends = data_weather.groupby('month').agg(
            PM2_5=('Roadside_PM2.5_Particulate (ug/m3)', 'mean'),
            NO2=('Roadside_Nitrogen_Dioxide (ug/m3)', 'mean'),
            Ozone=('Roadside_Ozone (ug/m3)', 'mean')
        ).reset_index()

        # Ensure the months are in order
        month_order = ["January", "February", "March", "April", "May", "June",
                       "July", "August", "September", "October", "November", "December"]
        monthly_trends['month'] = pd.Categorical(monthly_trends['month'], categories=month_order, ordered=True)
        monthly_trends = monthly_trends.sort_values('month')

        # Prepare the data to return
        trends = {
            "months": monthly_trends['month'].tolist(),
            "PM2.5": monthly_trends['PM2_5'].tolist(),
            "NO2": monthly_trends['NO2'].tolist(),
            "Ozone": monthly_trends['Ozone'].tolist()
        }
        return trends

    except Exception as e:
        return {"error": str(e)}

# ContactDialog.js
class ContactMessage(BaseModel):
    email: EmailStr
    message: str

@app.post("/api/contact")
async def submit_contact_form(contact_message: ContactMessage):
    try:
        # Here, you could process the message (e.g., send an email, save to a database, etc.)
        logging.info(f"Received contact message from {contact_message.email}: {contact_message.message}")

        # Send a response back to the client
        return {"status": "success", "message": "Your message has been sent."}
    
    except Exception as e:
        logging.error(f"Error processing contact message: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while processing your message.")