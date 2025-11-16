import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

interface LiveChartProps {
  pairId: string;
  price: number | null;
}

export default function LiveChart({ pairId, price }: LiveChartProps) {
  const [labels, setLabels] = useState<string[]>([]);
  const [dataPoints, setDataPoints] = useState<number[]>([]);

  useEffect(() => {
    if (price !== null) {
      setLabels((prev) => [...prev.slice(-19), new Date().toLocaleTimeString()]);
      setDataPoints((prev) => [...prev.slice(-19), price]);
    }
  }, [price]);

  const data = {
    labels,
    datasets: [
      {
        label: `${pairId} Price`,
        data: dataPoints,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.2)',
        tension: 0.3,
        pointRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { ticks: { color: '#888' } },
      y: { ticks: { color: '#888' } },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 w-full">
      <h3 className="text-lg font-semibold mb-2 text-indigo-600 dark:text-indigo-300">Live Chart: {pairId}</h3>
      <Line data={data} options={options} />
    </div>
  );
}