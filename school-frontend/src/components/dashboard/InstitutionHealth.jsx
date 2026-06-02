import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const InstitutionHealth = ({ healthScore, loading }) => {
  const overallScore = healthScore?.percentage || 82;

  const data = [
    { name: 'Score', value: overallScore, color: '#10b981' },
    { name: 'Remaining', value: 100 - overallScore, color: '#f1f5f9' },
  ];

  const breakdown = [
    { label: 'Academics', score: Math.round(overallScore * 0.95), color: 'bg-blue-500' },
    { label: 'Finance', score: Math.round(overallScore * 0.88), color: 'bg-amber-500' },
    { label: 'Operations', score: Math.round(overallScore * 1.05 > 100 ? 100 : overallScore * 1.05), color: 'bg-emerald-500' },
    { label: 'Compliance', score: Math.round(overallScore * 0.80), color: 'bg-rose-500' },
    { label: 'Staffing', score: Math.round(overallScore * 0.98), color: 'bg-indigo-500' },
  ];

  return (
    <div className="bg-white rounded-[16px] border border-[#f1f5f9] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] p-6 h-full flex flex-col">
      <h3 className="text-sm font-black text-slate-800 mb-4">Institution Health Score</h3>
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="w-32 h-32 mx-auto rounded-full bg-slate-100"></div>
          <div className="space-y-2 mt-6">
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-full"></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-32 h-32 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={60}
                    startAngle={225}
                    endAngle={-45}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={10}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                 <span className="text-3xl font-black text-slate-800 leading-none">{overallScore}<span className="text-sm text-slate-400">/100</span></span>
                 <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">{healthScore?.trend === 'UP' ? 'Improving' : 'Stable'}</span>
              </div>
            </div>
            
            <div className="flex-1 ml-6 space-y-3">
               {breakdown.map((item, idx) => (
                 <div key={idx} className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-500 w-16 truncate">{item.label}</span>
                    <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                       <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.score}%` }}></div>
                    </div>
                    <span className="text-[10px] font-black text-slate-700 w-6 text-right">{item.score}%</span>
                 </div>
               ))}
            </div>
          </div>
          
          <div className="mt-auto pt-4 border-t border-slate-50">
             <p className="text-xs font-bold text-slate-500 text-center">Keep up the good work! <span className="text-amber-500">8 areas need attention.</span></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(InstitutionHealth);