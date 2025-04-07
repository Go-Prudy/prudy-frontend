import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define the Props interface with default values
interface ChartProps {
  labels?: string[];
  values?: number[];
}

// Create the component
const BarChart: React.FC<ChartProps> = ({
  labels = [], // Default to empty array if labels are undefined
  values = [], // Default to empty array if values are undefined
}) => {
  // Prepare chart values: Replace negatives with 0 for plotting
  const chartValues = values.map((value) => (value < 0 ? 0 : value));

  // Data for the chart
  const data = {
    labels: labels,
    datasets: [
      {
        label: '₦',
        data: chartValues, // Use chart values here (negatives replaced with 0)
        backgroundColor: ['#00C0E6', '#FF6C00', '#9B59B6'],
        borderRadius: 20,
        width: 52,
      },
    ],
  };

  // Options for the chart
  const options: any = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        drawBorder: false,
      },
    },
  };

  return (
    <div className="border border-gray-200 rounded-3xl">
      <div className="mb-[51.4px] relative">
        <Bar
          data={data}
          className="w-full bg-gray-100 pt-5 rounded-t-3xl"
          options={options}
        />
        {/* Display the labels and values below the chart */}
        <div className="z-10 absolute px-[14.4px] inset-x-0 bottom-[-50px] bg-white grid grid-cols-3 gap-4 rounded-b-[24px]">
          {labels.map((label, index) => (
            <div key={index} className="text-center py-2">
              {/* Show the original value in red if negative */}
              <div
                className={`font-[500] ${
                  values[index] < 0 ? 'text-red-500' : 'text-[#060221]'
                }`}
              >
                {values[index] != null ? '₦ ' + values[index].toLocaleString() : 'N/A'}
              </div>
              <div className="text-[12px] text-[#A0A3BD]">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BarChart;
