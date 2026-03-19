import React from 'react';

const StatCard = ({ label, value, icon: Icon, colorClass }) => {
  return (
    <div className="bg-white p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 bg-slate-50 text-black border border-slate-100`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <p className="text-2xl font-black text-black mt-1 tracking-tight">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;