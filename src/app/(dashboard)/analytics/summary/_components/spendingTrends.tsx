import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
// import { Remark } from '@/app/types/analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

type Props = {
  analytics:
    | {
        day: string;
        amount: number;
      }[]
    | null;
};

export const options = {
  responsive: true,
  scales: {
    y: {
      display: true,
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
    x: {
      display: true,
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      position: 'top' as const,
      display: false,
    },
    title: {
      display: false,
    },
  },
};

const labels = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];

export default function SpendingTrends({ analytics }: Props) {
  console.log('weeklySpending:', analytics);
  const [weeklySpending, setWeeklySpending] = useState<number[]>([]);

  useEffect(() => {
    const mappedAmounts = Array.isArray(analytics)
      ? analytics.map((item) => item.amount)
      : [];
    console.log('mapped amounts:', mappedAmounts);
    setWeeklySpending(mappedAmounts);
  }, [analytics]);

  console.log('mapped amounts:', weeklySpending);
  return (
    <div>
      <div className="space-y-7">
        <div className="p-4 bg-white rounded-2xl space-y-3 w-fit text-left mx-auto">
          <p className="text-sm text-black-800 font-medium">Spending Trend</p>
          <Line
            options={options}
            data={{
              labels,
              datasets: [
                {
                  label: 'Weekly Spending',
                  data:
                    weeklySpending.length > 0 ? weeklySpending : [0, 0, 0, 0, 0, 0, 0],
                  borderColor: '#21CBE2',
                  backgroundColor: 'rgba(102, 194, 39, 0.1)',
                  tension: 0,
                  pointRadius: 0,
                },
              ],
            }}
          />
        </div>
        {/* <div className="text-white space-y-4">
          <h6 className="text-xl font-bold space-y-4">{analytics?.remark?.title}</h6>
          <p>{analytics?.remark?.description}</p>
        </div> */}
      </div>
    </div>
  );
}
