import React from 'react';

const DashboardHeader = ({ title, subtitle }) => {
  return (
    <div className="mb-6">
      <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tighter">{title}</h1>
      <p className="text-[10px] lg:text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{subtitle}</p>
    </div>
  );
};

export default React.memo(DashboardHeader);
