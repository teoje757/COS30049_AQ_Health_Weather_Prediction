import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Ridge
from sklearn.multioutput import MultiOutputRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import matplotlib.pyplot as plt
import joblib
import os

# Load and preprocess data
def load_and_preprocess_data(filepath):
    data = pd.read_csv(filepath)
    data = data.dropna()  # Drop rows with missing values
    
    # Convert 'date' column to datetime format
    data['date'] = pd.to_datetime(data['date'], format='%Y-%m')
    data.set_index('date', inplace=True)  # Set 'date' as the index
    
    # Print available columns to verify
    print("Available columns in the dataset:", data.columns)
    
    return data

# Print evaluation metrics
def print_metrics(y_true, y_pred, target_name):
    mse = mean_squared_error(y_true, y_pred)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(y_true, y_pred)
    r2 = r2_score(y_true, y_pred)
    
    print(f"{target_name} - MSE: {mse:.4f}, RMSE: {rmse:.4f}, MAE: {mae:.4f}, R²: {r2:.4f}")

# Plot residuals
def plot_residuals(y_true, y_pred, target_name):
    residuals = y_true - y_pred
    plt.figure(figsize=(8, 6))
    plt.scatter(y_pred, residuals, alpha=0.5)
    plt.axhline(0, color='red', linestyle='--')
    plt.xlabel('Predicted')
    plt.ylabel('Residuals')
    plt.title(f'Residuals for {target_name}')
    plt.show()

# Ridge Regression model function for multi-output
def model_ridge_regression_multioutput(data, models_path):
    # Define feature columns based on available data
    X = data[['mean_temp', 'wspd', 'wdir', 'precipitation', 'pressure',
              'Roadside_Nitrogen_Dioxide (ug/m3)', 'Roadside_Ozone (ug/m3)',       
              'Roadside_PM10_Particulate (ug/m3)', 'Roadside_PM2.5_Particulate (ug/m3)',
              'Background_Nitrogen_Dioxide (ug/m3)', 'Background_Ozone (ug/m3)',   
              'Background_PM10_Particulate (ug/m3)', 'Background_PM2.5_Particulate (ug/m3)']]
    
    # Define targets for multi-output
    y = data[['Roadside_PM2.5_Particulate (ug/m3)', 'Background_Nitrogen_Dioxide (ug/m3)', 'Roadside_Ozone (ug/m3)']]

    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Standardize the data
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Hyperparameter tuning with GridSearchCV on Ridge
    param_grid = {'estimator__alpha': np.logspace(-3, 3, 7)}
    ridge_model = MultiOutputRegressor(Ridge())
    grid_search = GridSearchCV(ridge_model, param_grid, cv=5, scoring='neg_mean_squared_error')
    grid_search.fit(X_train_scaled, y_train)

    # Retrieve the best model and its parameters
    best_model = grid_search.best_estimator_
    best_alpha = grid_search.best_params_['estimator__alpha']
    print(f'Best Alpha for Multi-Output Ridge Regression: {best_alpha}')

    # Fit the best model
    best_model.fit(X_train_scaled, y_train)
    y_pred = best_model.predict(X_test_scaled)

    # Evaluate metrics for each target variable
    for i, target_name in enumerate(y.columns):
        print_metrics(y_test.iloc[:, i], y_pred[:, i], target_name)
        plot_residuals(y_test.iloc[:, i], y_pred[:, i], target_name)

    # Save the model and scaler separately
    model_path = os.path.join(models_path, 'aq_weather_regression.pkl')
    scaler_path = os.path.join(models_path, 'scaler_weather.pkl')
    
    joblib.dump(best_model, model_path)
    joblib.dump(scaler, scaler_path)
    
    print(f"Model saved at {model_path}")
    print(f"Scaler saved at {scaler_path}")

# Main execution
if __name__ == "__main__":
    filepath = "C:\\Users\\User\\OneDrive\\Desktop\\COS30049 Computing Technology Innovation Project\\Assignment 3\\data\\merged_weather_air_quality_cleaned_renamed.csv"
    models_path = "C:\\Users\\User\\OneDrive\\Desktop\\COS30049 Computing Technology Innovation Project\\Assignment 3\\models"

    # Ensure models_path exists
    os.makedirs(models_path, exist_ok=True)

    # Load and preprocess data
    data = load_and_preprocess_data(filepath)
    
    # Train multi-output model and save it
    model_ridge_regression_multioutput(data, models_path)