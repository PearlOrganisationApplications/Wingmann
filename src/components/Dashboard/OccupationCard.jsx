import React from 'react';

const OccupationCard = ({ label, count, icon: Icon, percentage }) => (
  <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm flex items-center gap-6 group hover:border-slate-900 transition-all">
    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all shrink-0">
      <Icon size={28} strokeWidth={1.5} />
    </div>
    
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h3 className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{label}</h3>
          <p className="text-3xl font-black text-slate-900 tracking-tighter mt-1">{count.toLocaleString()}</p>
        </div>
        <div className="text-right">
           <span className="text-xl font-black text-slate-900">{percentage}%</span>
        </div>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-slate-900 transition-all duration-1000" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  </div>
);

export default OccupationCard;