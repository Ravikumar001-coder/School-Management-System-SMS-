import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#2563eb', '#312e81', '#8b5cf6', '#a78bfa', '#14b8a6', '#64748b', '#cbd5e1'];

const renderLegend = (props) => {
  const { payload } = props;
  return (
    <ul className="space-y-2">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full text-slate-400">
    <p className="text-sm font-bold">No enrollment records</p>
  </div>
);

const EnrollmentDonutChart = ({ distribution = {}, loading }) => {
  const data = useMemo(() => {
    if (!distribution || Object.keys(distribution).length === 0) return [];
    return Object.entries(distribution).map(([name, value], i) => ({
      name,
      value,
      color: COLORS[i % COLORS.length]
    }));
  }, [distribution]);

  return (
    <div className="lg:col-span-1 bg-white rounded-[16px] border border-[#f1f5f9] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] p-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-black text-slate-800">Student Enrollment</h3>
        <button 
          className="bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 text-white text-xs lg:text-[10px] uppercase tracking-widest font-black px-4 py-2 rounded-xl transition-all shadow-md active:scale-95"
          aria-label="Generate General Report"
        >
          Generate Report
        </button>
      </div>
      <div className="h-64 mt-4 relative">
        {loading ? (
          <div className="absolute inset-0 bg-slate-100 animate-pulse rounded-full m-4" aria-busy="true" />
        ) : data.length === 0 ? (
          <EmptyState />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="40%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend content={renderLegend} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ right: 0 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default React.memo(EnrollmentDonutChart);
