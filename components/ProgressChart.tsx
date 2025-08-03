import React from 'react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { Session } from '../types';

interface ProgressChartProps {
  title: string;
  data: Session[];
  dataKey: 'score' | 'accuracy' | 'duration';
  color: string;
  unit?: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ title, data, dataKey, color, unit }) => {
  const formattedData = data.map(session => ({
    ...session,
    date: new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  if (data.length === 0) {
    return (
       <div className="bg-white p-6 rounded-xl shadow-lg h-80 flex flex-col justify-center items-center">
        <h3 className="text-xl font-bold mb-2 text-slate-800">{title}</h3>
        <p className="text-slate-500">No data available yet. Play a game to see your progress!</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-slate-800">{title}</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" stroke="#64748b" />
            <YAxis stroke="#64748b" unit={unit} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(5px)',
                border: '1px solid #e0e0e0',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ fontWeight: 'bold' }}
              formatter={(value: number) => [`${value}${unit || ''}`, dataKey.charAt(0).toUpperCase() + dataKey.slice(1)]}
            />
            <Legend />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;
