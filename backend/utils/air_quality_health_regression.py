import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestRegressor
from sklearn.multioutput import MultiOutputRegressor
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.preprocessing import StandardScaler
import joblib
import os

# Data cleaning + IQR removing outliers
def load_and_preprocess_data(filepath):
    data = pd.read_csv(filepath, thousands=',')
    data.dropna(inplace=True)
    
    numeric_cols = data.select_dtypes(include=[np.number]).columns
    Q1 = data[numeric_cols].quantile(0.25)
    Q3 = data[numeric_cols].quantile(0.75)
    IQR = Q3 - Q1
    data = data[~((data[numeric_cols] < (Q1 - 1.5 * IQR)) | (data[numeric_cols] > (Q3 + 1.5 * IQR))).any(axis=1)]
    
    # Specify the directory where you want to save the cleaned data
    target_dir = "C://Users//User//OneDrive//Desktop//COS30049 Computing Technology Innovation Project//Assignment 3//data"
    
    # Create the cleaned filepath using the specified target directory
    cleaned_filepath = os.path.join(target_dir, os.path.basename(filepath).replace(".csv", "_cleaned.csv"))
    
    data.to_csv(cleaned_filepath, index=False)
    return data

def model_random_forest_health(data):
    # Combine targets into a single DataFrame
    health_variables = ['All respiratory deaths', 'Bronchiectasis', 'COPD']
    X = data[['London Mean Roadside:Nitrogen Dioxide (ug/m3)', 
               'London Mean Roadside:PM10 Particulate (ug/m3)', 
               'London Mean Roadside:PM2.5 Particulate (ug/m3)', 
               'London Mean Roadside:Ozone (ug/m3)', 
               'London Mean Roadside:Sulphur Dioxide (ug/m3)', 
               'London Mean Background:Nitrogen Dioxide (ug/m3)', 
               'London Mean Background:Ozone (ug/m3)', 
               'London Mean Background:PM10 Particulate (ug/m3)', 
               'London Mean Background:PM2.5 Particulate (ug/m3)', 
               'London Mean Background:Sulphur Dioxide (ug/m3)']]
    
    y = data[health_variables]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Using MultiOutputRegressor for multiple outputs
    rf_model = RandomForestRegressor(random_state=42)
    multi_target_model = MultiOutputRegressor(rf_model)

    rf_param_grid = {
        'estimator__n_estimators': [50, 100],  # Reduced for quicker testing
        'estimator__max_depth': [None, 10],
        'estimator__min_samples_split': [2, 5]
    }
    
    try:
        rf_grid_search = GridSearchCV(multi_target_model, rf_param_grid, cv=3, 
                                       scoring='neg_mean_squared_error', n_jobs=-1, verbose=2)
        rf_grid_search.fit(X_train_scaled, y_train)
        best_rf_params = rf_grid_search.best_params_

        # Fit the best model
        best_rf_model = RandomForestRegressor(**{k.split('__')[1]: v for k, v in best_rf_params.items()}, random_state=42)
        final_model = MultiOutputRegressor(best_rf_model)
        final_model.fit(X_train_scaled, y_train)

        # Make predictions
        y_pred = final_model.predict(X_test_scaled)

        # Print metrics for each health outcome
        for i, variable in enumerate(health_variables):
            print_metrics(y_test.iloc[:, i], y_pred[:, i], variable)
        
        return y_test, y_pred, final_model, scaler
    except Exception as e:
        print("Error during model training:", str(e))
        return None, None, None, None

def print_metrics(y_test, y_pred, variable_name):
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    
    print(f'Random Forest - {variable_name} Metrics:')
    print(f'MSE: {mse:.4f}, R²: {r2:.4f}, MAE: {mae:.4f}, RMSE: {rmse:.4f}')

if __name__ == "__main__":
    filepath = "C://Users//User//OneDrive//Desktop//COS30049 Computing Technology Innovation Project//Assignment 3//data//aqhealth_merged.csv"

    data = load_and_preprocess_data(filepath)
    
    output_models_dir = "C://Users//User//OneDrive//Desktop//COS30049 Computing Technology Innovation Project//Assignment 3//models"
    
    # Make sure directories exist
    os.makedirs(output_models_dir, exist_ok=True)

    # Random Forest Modeling
    y_test, y_pred, final_model, scaler = model_random_forest_health(data)

    # Save the final model and the scaler separately
    if final_model and scaler:
        model_path = os.path.join(output_models_dir, 'aq_health_regression.pkl')
        scaler_path = os.path.join(output_models_dir, 'scaler_health.pkl')
        
        joblib.dump(final_model, model_path)
        joblib.dump(scaler, scaler_path)
        
        print(f"Model saved at {model_path}")
        print(f"Scaler saved at {scaler_path}")
    else:
        print("Model or scaler could not be saved due to an issue during training.")