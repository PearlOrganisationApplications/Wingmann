import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, Briefcase, Loader2 } from 'lucide-react';
import GenderChart from '../components/Dashboard/GenderChart';
import OccupationCard from '../components/Dashboard/OccupationCard';
import AgeDistribution from '../components/Dashboard/AgeDistribution';
import { getUserAnalytics } from '../api/demographicsApi';

const Demographics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserAnalytics();
        if (response.success) setData(response.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-slate-400" size={40} />
    </div>
  );

  if (!data) return <div className="p-10 text-center uppercase font-black">No Data Found</div>;

  // 1. Format Regional Breakdown
  const formattedRegional = data.top5States.map(item => ({
    location: item.state,
    count: item.userCount
  }));

  // 2. Format Occupation
  const formattedOccupation = data.employmentStatus.map(item => ({
    label: item.label === 'Student' ? 'Academic / Students' : 'Corporate / Professionals',
    count: item.count,
    icon: item.label === 'Student' ? GraduationCap : Briefcase,
    percentage: parseFloat(item.percentage)
  }));

  // 3. Format Age
  const formattedAgeData = {
    average: 24, // Static fallback or calculation
    distribution: data.ageAnalytics.map(item => ({
      range: item.range,
      percentage: parseFloat(item.percentage)
    }))
  };

  return (
    <div className="max-w-7xl mx-auto bg-slate-50/30 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 p-6 pb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">User Analytics</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Active Demographic Intelligence</p>
        </div>
        <div className="flex items-center gap-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm px-8">
          <div className="p-3 bg-slate-900 text-white rounded-xl shadow-lg"><Users size={22} /></div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Audience</p>
            <p className="text-2xl font-black text-slate-900 leading-none mt-1">
              {data.genderAnalytics.totalGenderUsers.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* ROW 1: Gender & Regional */}
      <GenderChart
        maleCount={data.genderAnalytics.maleCount}
        femaleCount={data.genderAnalytics.femaleCount}
        ratio={data.genderAnalytics.ratio} // Pass the "1:0" string directly
        totalUsers={data.genderAnalytics.totalGenderUsers}
        regionalBreakdown={formattedRegional}
      />

      {/* ROW 2: Age & Occupation */}
      <div className="grid grid-cols-1 p-6 lg:grid-cols-2 gap-6 items-stretch">
        <AgeDistribution ageData={formattedAgeData} />

        <div className="flex flex-col gap-6">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Market Segments</h3>
          {formattedOccupation.map((item, idx) => (
            <OccupationCard key={idx} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Demographics;  