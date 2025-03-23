import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
  LineController,
} from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Title, LineController);

const AirQualityTrendsChart = () => {
  // Reference to the canvas element for Chart.js
  const chartRef = useRef(null);
  // State to hold the data for the chart
  const [chartData, setChartData] = useState({ months: [], PM2_5: [], NO2: [], Ozone: [] });

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch air quality trends data from the API
        const response = await fetch('http://localhost:8000/api/air_quality_trends');
        const data = await response.json();

        // Check for errors in the response
        if (!data.error) {
          // Update state with fetched data
          setChartData(data);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the fetch function
    fetchData();
  }, []); // Empty dependency array to run this effect only once

  // useEffect hook to create or update the chart when chartData changes
  useEffect(() => {
    const ctx = chartRef.current.getContext('2d'); // Get the canvas context

    // Destroy previous chart instance if it exists to avoid memory leaks
    if (chartRef.current.chartInstance) {
      chartRef.current.chartInstance.destroy();
    }

    // Data to plot in the chart
    const data = {
      labels: chartData.months, // X-axis labels (months)
      datasets: [
        {
          label: 'PM2.5 (µg/m³)', // First dataset for PM2.5
          data: chartData['PM2.5'], // Data for PM2.5
          borderColor: 'rgba(255, 99, 132, 1)', // Line color for PM2.5
          backgroundColor: 'rgba(255, 99, 132, 0.2)', // Area color for PM2.5
          borderWidth: 2, // Width of the line
          tension: 0.3, // Smoothness of the line
        },
        {
          label: 'NO2 (µg/m³)', // Second dataset for NO2
          data: chartData.NO2, // Data for NO2
          borderColor: 'rgba(54, 162, 235, 1)', // Line color for NO2
          backgroundColor: 'rgba(54, 162, 235, 0.2)', // Area color for NO2
          borderWidth: 2,
          tension: 0.3,
        },
        {
          label: 'Ozone (µg/m³)', // Third dataset for Ozone
          data: chartData.Ozone, // Data for Ozone
          borderColor: 'rgba(75, 192, 192, 1)', // Line color for Ozone
          backgroundColor: 'rgba(75, 192, 192, 0.2)', // Area color for Ozone
          borderWidth: 2,
          tension: 0.3,
        }
      ]
    };

    // Create line chart instance
    chartRef.current.chartInstance = new ChartJS(ctx, {
      type: 'line', // Chart type
      data, // Data to be plotted
      options: {
        responsive: true, // Make chart responsive
        plugins: {
          legend: {
            position: 'top', // Position of the legend
          },
          title: {
            display: true, // Display chart title
            text: 'Concentration Trends of PM2.5, NO2, and Ozone', // Title text
          },
        },
        scales: {
          y: {
            beginAtZero: true, // Y-axis starts at zero
          },
        },
      },
    });

    // Cleanup function to destroy the chart on component unmount
    return () => {
      if (chartRef.current.chartInstance) {
        chartRef.current.chartInstance.destroy();
      }
    };
  }, [chartData]); // Dependency array to re-run this effect when chartData changes

  // Render the canvas for the chart
  return <canvas ref={chartRef} style={{ width: '100%', height: '80%', margin: '100px' }}></canvas>;
};

export default AirQualityTrendsChart;