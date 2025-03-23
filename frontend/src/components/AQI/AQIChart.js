import React, { useEffect, useState } from 'react';
import Plotly from 'plotly.js-dist';

const AQIChart = () => {
  const [aqiValues, setAqiValues] = useState([]);

  useEffect(() => {
    // Function to fetch weekly AQI predictions from the API
    const fetchWeeklyAQI = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/predict_weekly_aqi/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ days_ahead: 7 }), // Requesting 7 days of predictions
        });

        if (!response.ok) {
          throw new Error('Failed to fetch AQI data');
        }

        const data = await response.json();
        setAqiValues(data.weekly_aqi); // Assuming the response structure contains weekly_aqi
      } catch (error) {
        console.error('Error fetching weekly AQI:', error);
      }
    };

    fetchWeeklyAQI(); // Call the function to fetch AQI values
  }, []); // Empty dependency array to run once on mount

  useEffect(() => {
    // Only render the chart when aqiValues has been set
    if (aqiValues.length > 0) {
      const aqiData = {
        x: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        y: aqiValues,
        type: 'bar',
        marker: {
          color: '#00CD85',
          line: {
            color: '#00CD85',
            width: 2,
          },
        },
        hoverinfo: 'text',
        text: aqiValues.map((value) => `AQI: ${value}`),
        opacity: 0.8,
        width: 0.6,
        hovertemplate: '%{text}<extra></extra>',
      };

      const layout = {
        title: 'Weekly AQI Levels',
        xaxis: {
          title: 'Days',
          tickangle: 0,
        },
        yaxis: {
          title: 'AQI Value',
        },
        margin: {
          l: 200,
          r: 200,
          t: 50,
          b: 100,
        },
        plot_bgcolor: '#f7f7f7',
        paper_bgcolor: '#ffffff',
        barmode: 'group',
        barcornerradius: 25,
      };

      const config = { responsive: true };

      // Render chart once data is available
      Plotly.newPlot('aqi-chart', [aqiData], layout, config);
    }
  }, [aqiValues]); // Only redraw chart when aqiValues changes (after initial fetch)

  return (
    <div id="aqi-chart" style={{ width: '90%', height: '500px', margin: 'auto' }}></div>
  );
};

export default AQIChart;
