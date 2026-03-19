import React from 'react';
import { TrendingUp } from 'lucide-react';

const AgeDistribution = ({ ageData }) => (
  <div className="bg-white p-8 border border-slate-200 rounded-2xl shadow-sm flex flex-col h-full">
    <div className="flex justify-between items-start mb-10">
      <div>
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Age Distribution</h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Demographic Concentration</p>
      </div>
      <div className="bg-slate-50 border border-slate-200 px-5 py-3 text-right rounded-xl">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Age</p>
        <p className="text-3xl font-black text-slate-900 leading-none">{ageData.average}</p>
      </div>
    </div>

    <div className="flex-1 flex justify-around items-end h-64 gap-6 px-4">
      {ageData.distribution.map((group, idx) => (
        <div key={idx} className="flex flex-col items-center gap-4 w-full max-w-[80px] group">
          <div className="relative w-full bg-slate-50 h-52 rounded-xl overflow-hidden border border-slate-100 flex flex-col justify-end">
            <div 
              className="w-full bg-slate-200 group-hover:bg-slate-900 transition-all duration-500 rounded-t-lg"
              style={{ height: `${group.percentage}%` }}
            />
             <div className="absolute inset-x-0 top-3 text-center opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-[11px] font-black text-slate-900">{group.percentage}%</span>
            </div>
          </div>
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-tighter">{group.range}</p>
        </div>
      ))}
    </div>

    <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-3">
        <div className="p-1.5 bg-slate-900 text-white rounded-lg"><TrendingUp size={14} /></div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Dominant Base: <span className="text-slate-900 font-black">Ages 18-24</span>
        </p>
    </div>
  </div>
);

export default AgeDistribution;