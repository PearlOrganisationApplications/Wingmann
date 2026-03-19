import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LabelList
} from 'recharts';
import {
  ArrowUpRight, Users, Calendar, MousePointer2,
  ClipboardCheck, CheckCircle, XCircle, Filter
} from 'lucide-react';

// Import the API handler
import { getDashboardOverview } from '../api/overviewApi';

const THEME_DARK = "#1F1F2E";

const Overview = () => {
  // 1. State Management
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default: Last 14 days
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // 2. Fetch Data
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const result = await getDashboardOverview(startDate, endDate);
        setData(result);
      } catch (error) {
        console.error("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [startDate, endDate]);

  // 3. Helper: Fill missing dates so the graph is continuous
  const trafficTrendData = useMemo(() => {
    if (!data) return [];

    const dayList = [];
    let current = new Date(startDate);
    const stop = new Date(endDate);

    // Map existing API data for quick lookup
    const apiDataMap = {};
    data.traffic.weekly.forEach(item => {
      apiDataMap[item.date] = item.visits;
    });

    // Loop through every day in range
    while (current <= stop) {
      const dateStr = current.toISOString().split('T')[0];
      dayList.push({
        displayDate: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        visits: apiDataMap[dateStr] || 0, // Fallback to 0 if no data for this day
      });
      current.setDate(current.getDate() + 1);
    }
    return dayList;
  }, [data, startDate, endDate]);

  // 4. Data for other charts
  const acquisitionData = useMemo(() => [
    { name: 'Visits', value: data?.traffic?.today || 0, color: THEME_DARK },
    { name: 'Signups', value: data?.dashboard?.users?.total || 0, color: '#4F46E5' },
    { name: 'Interviews', value: data?.dashboard?.interviews?.total || 0, color: '#94A3B8' },
    { name: 'Dates', value: data?.dashboard?.datesPlanned?.total || 0, color: '#CBD5E1' },
  ], [data]);

  const outcomeData = useMemo(() => [
    { name: 'Accepted', value: data?.bookings?.accepted || 0, fill: THEME_DARK },
    { name: 'Rejected', value: data?.bookings?.rejected || 0, fill: '#E2E8F0' },
  ], [data]);

  // Sub-component for KPI Cards
  const StatCard = ({ title, value, icon: Icon, trend, subtext, isHero }) => (
    <div className={`p-8 rounded-[2.5rem] transition-all flex flex-col justify-between h-56 ${isHero ? 'bg-[#1F1F2E] text-white shadow-2xl shadow-[#1F1F2E]/30' : 'bg-white text-[#1F1F2E] border border-slate-100 shadow-sm'
      }`}>
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-2xl ${isHero ? 'bg-white/10' : 'bg-[#F5F6FA]'}`}>
          <Icon size={22} className={isHero ? 'text-white' : 'text-[#1F1F2E]'} />
        </div>
        <span className={`flex items-center text-[11px] font-bold px-3 py-1.5 rounded-full ${isHero ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
          }`}>
          <ArrowUpRight size={14} className="mr-1" /> {trend}
        </span>
      </div>
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1 opacity-60">{title}</h3>
        <p className="text-4xl font-black tracking-tight">
          {loading ? "..." : value?.toLocaleString()}
        </p>
        <p className="text-[10px] mt-2 font-bold uppercase tracking-widest opacity-40">{subtext}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F6FA] w-full md:p-10 space-y-10 overflow-x-hidden">

      {/* HEADER & DATE RANGE FILTER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-[#1F1F2E] tracking-tight">Analytics Overview</h2>
          <p className="text-sm text-slate-400 font-medium">Performance metrics for the selected duration</p>
        </div>

        <div className="flex items-center gap-4 bg-[#F5F6FA] p-3 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 px-3 border-r border-slate-300">
            <Filter size={16} className="text-slate-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Filter</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#1F1F2E] outline-none cursor-pointer"
            />
            <span className="text-slate-300 font-bold">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#1F1F2E] outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Total Traffic" value={data?.traffic?.today} icon={MousePointer2} trend="Live" subtext="Today's Active Visits" isHero={true} />
        <StatCard title="New Signups" value={data?.dashboard?.users?.total} icon={Users} trend={data?.dashboard?.users?.growth} subtext="User acquisition" />
        <StatCard title="Scheduled" value={data?.dashboard?.interviews?.total} icon={ClipboardCheck} trend={data?.dashboard?.interviews?.growth} subtext="Interviews in range" />
        <StatCard title="Dates Planned" value={data?.dashboard?.datesPlanned?.total} icon={Calendar} trend={data?.dashboard?.datesPlanned?.growth} subtext="Successful matches" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ACQUISITION FUNNEL */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-[#1F1F2E] tracking-tight mb-10">Acquisition Funnel</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={acquisitionData} margin={{ top: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontWeight: '700', fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis hide />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={55}>
                  {acquisitionData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  <LabelList dataKey="value" position="top" style={{ fill: THEME_DARK, fontSize: '12px', fontWeight: '900' }} offset={15} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BOOKING SUCCESS PIE */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#1F1F2E] tracking-tight">Booking Ratio</h3>
            <p className="text-sm text-slate-400 font-medium mt-1">Acceptance Performance</p>
          </div>
          <div className="h-60 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={outcomeData} innerRadius={75} outerRadius={95} startAngle={180} endAngle={0} paddingAngle={8} dataKey="value" stroke="none">
                  {outcomeData.map((entry, index) => <Cell key={index} fill={entry.fill} cornerRadius={10} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-12">
              <span className="text-4xl font-black text-[#1F1F2E]">{data?.bookings?.acceptedPercentage || "0%"}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Accepted</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 bg-[#F5F6FA] rounded-2xl">
              <span className="flex items-center gap-3 text-xs font-bold text-slate-500"><CheckCircle size={16} className="text-[#1F1F2E]" /> Accepted</span>
              <span className="text-sm font-bold text-[#1F1F2E]">{data?.bookings?.accepted || 0}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-[#F5F6FA] rounded-2xl opacity-50">
              <span className="flex items-center gap-3 text-xs font-bold text-slate-500"><XCircle size={16} className="text-slate-400" /> Rejected</span>
              <span className="text-sm font-bold text-slate-400">{data?.bookings?.rejected || 0}</span>
            </div>
          </div>
        </div>

        {/* VISITOR INTENSITY - THE FULL TIMELINE */}
        <div className="lg:col-span-3 bg-[#1F1F2E] p-10 rounded-[3rem] shadow-2xl text-white">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-bold tracking-tight">Visitor Intensity</h3>
              <p className="text-sm text-white/40 font-medium mt-1">Traffic flow from {startDate} to {endDate}</p>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/10">
              <span className="text-xs font-bold text-emerald-400">Live Sync</span>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficTrendData}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="displayDate"
                  axisLine={false}
                  tickLine={false}
                  minTickGap={30}
                  tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)', fontWeight: 700 }}
                  dy={10}
                />
                <YAxis hide domain={[0, 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F1F2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Area
                  type="monotone"
                  dataKey="visits"
                  stroke="#4F46E5"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorTraffic)"
                  animationDuration={1200}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;