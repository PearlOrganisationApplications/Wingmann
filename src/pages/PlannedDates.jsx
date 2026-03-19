import React, { useState, useMemo } from 'react';
import {
  MapPin, Calendar, Users, ChevronRight,
  Clock, Phone, Mail, X, Globe, AlertCircle, Trash2, CalendarDays
} from 'lucide-react';

const PlannedDates = () => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedCity, setSelectedCity] = useState('All');
  const [activeTab, setActiveTab] = useState('planned');
  const [viewingDetails, setViewingDetails] = useState(null);

  const rawDates = [
    {
      id: 1,
      restaurant: "The Grand Italian",
      city: "Mumbai",
      location: "Bandra West",
      time: "07:00 PM",
      date: todayStr,
      status: "Confirmed",
      category: "Dinner",
      restaurantPhone: "+91 22 4567 8901",
      participants: [
        { name: "John Doe", phone: "+91 98765 00001", email: "john.d@gmail.com", photo: "J" },
        { name: "Sarah Khan", phone: "+91 98765 00002", email: "sarah.k@yahoo.com", photo: "S" }
      ]
    },
    {
      id: 2,
      restaurant: "Blue Bottle Coffee",
      city: "Bengaluru",
      location: "Indiranagar",
      time: "10:00 AM",
      date: todayStr,
      status: "Confirmed",
      category: "Breakfast",
      restaurantPhone: "+91 80 1234 5678",
      participants: [
        { name: "Alex V", phone: "+91 98765 00003", email: "alex@wingmates.com", photo: "A" },
        { name: "Taylor S", phone: "+91 98765 00004", email: "taylor@gmail.com", photo: "T" }
      ]
    },
    {
      id: 3,
      restaurant: "Olive Bar & Kitchen",
      city: "Mumbai",
      location: "Khar",
      time: "08:30 PM",
      date: "2025-12-30",
      status: "Confirmed",
      category: "Dinner",
      restaurantPhone: "+91 22 4567 8901",
      participants: [
        { name: "Mike R", phone: "+91 98765 55555", email: "mike@gmail.com", photo: "M" },
        { name: "Lisa W", phone: "+91 98765 66666", email: "lisa@yahoo.com", photo: "L" }
      ]
    },
    {
      id: 101,
      restaurant: "Social Offline",
      city: "Mumbai",
      location: "Colaba",
      time: "09:00 PM",
      date: todayStr,
      status: "Cancelled",
      cancelReason: "Sarah reported feeling unwell.",
      category: "Drinks",
      restaurantPhone: "+91 22 9999 8888",
      participants: [{ name: "Rahul M", photo: "R" }, { name: "Sneha G", photo: "S" }]
    }
  ];

  const getDateLabel = (dateStr) => {
    if (dateStr === todayStr) return "Today";
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (dateStr === tomorrow.toISOString().split('T')[0]) return "Tomorrow";
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const groupedDates = useMemo(() => {
    const filtered = rawDates.filter(d => {
      const matchCity = selectedCity === 'All' || d.city === selectedCity;
      const matchStatus = activeTab === 'planned' ? d.status !== 'Cancelled' : d.status === 'Cancelled';
      return matchCity && matchStatus;
    });

    const groups = filtered.reduce((acc, curr) => {
      if (!acc[curr.date]) acc[curr.date] = [];
      acc[curr.date].push(curr);
      return acc;
    }, {});

    return Object.keys(groups).sort().map(date => ({
      date,
      label: getDateLabel(date),
      items: groups[date]
    }));
  }, [selectedCity, activeTab]);

  const cities = ['All', 'Mumbai', 'Bengaluru', 'Delhi', 'Pune'];

  return (
    <div className="max-w-7xl mx-auto space-y-10 p-6 bg-white min-h-screen font-sans">

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-slate-100 pb-10">
        <div>
          <h1 className="text-4xl font-black text-black tracking-tighter uppercase italic">Timeline Directory</h1>
          <p className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.3em] mt-2">Logistics & Schedule Management</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          {/* Tab Switcher - Sleek Black/White */}
          <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('planned')}
              className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'planned' ? 'bg-black text-white shadow-lg' : 'text-slate-400 hover:text-black'}`}
            >
              Planned
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'cancelled' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:text-black'}`}
            >
              Cancelled
            </button>
          </div>

          {/* Date Picker */}
          <div className="relative flex items-center bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm focus-within:border-black transition-all">
            <CalendarDays size={16} className="text-slate-400 mr-3" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none text-[11px] font-black text-black uppercase tracking-widest focus:ring-0 cursor-pointer outline-none"
            />
          </div>
        </div>
      </div>

      {/* City Filters - Minimalist Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
        {cities.map(city => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${selectedCity === city
              ? 'bg-black border-black text-white shadow-md'
              : 'bg-white border-slate-200 text-slate-400 hover:border-black hover:text-black'
              }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Chronological Content */}
      <div className="space-y-16">
        {groupedDates.length > 0 ? (
          groupedDates.map((group) => (
            <div key={group.date} className="space-y-8">
              {/* Divider with Date Label */}
              <div className="flex items-center gap-6">
                <div className="h-px flex-1 bg-slate-100" />
                <h2 className={`text-[11px] font-black uppercase tracking-[0.4em] ${group.date === todayStr ? 'text-black' : 'text-slate-300'}`}>
                  {group.label}
                </h2>
                <div className="h-px flex-1 bg-slate-100" />
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {group.items.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => setViewingDetails(d)}
                    className={`bg-white group p-8 rounded-[2.5rem] border-2 transition-all duration-300 hover:shadow-2xl cursor-pointer ${activeTab === 'cancelled' ? 'border-rose-50 hover:border-rose-200' : 'border-slate-50 hover:border-black'
                      }`}
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div className="bg-slate-50 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-slate-100">
                        <Globe size={12} className="text-black" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{d.city}</span>
                      </div>
                      <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-md border ${d.status === 'Confirmed' ? 'border-emerald-200 text-emerald-600 bg-emerald-50' : 'border-rose-200 text-rose-600 bg-rose-50'
                        }`}>{d.status}</span>
                    </div>

                    <h3 className="text-2xl font-black text-black tracking-tight uppercase leading-tight mb-2">{d.restaurant}</h3>
                    <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider mb-8">
                      <MapPin size={12} className="text-black" /> {d.location}
                    </p>

                    {activeTab === 'cancelled' && (
                      <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl mb-8">
                        <p className="text-[10px] font-bold text-rose-600 uppercase tracking-tight italic">Reason: {d.cancelReason}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-end border-t border-slate-50 pt-8">
                      <div className="flex -space-x-3">
                        {d.participants.map((p, i) => (
                          <div key={i} className={`w-12 h-12 rounded-xl border-4 border-white flex items-center justify-center text-xs font-black text-white shadow-sm ${i === 0 ? 'bg-black' : 'bg-slate-300'}`}>
                            {p.photo}
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Schedule</span>
                        <div className="flex items-center gap-1.5 text-black font-black">
                          <Clock size={16} />
                          <span className="text-base">{d.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="py-40 flex flex-col items-center justify-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <Calendar size={48} className="text-slate-200 mb-4" strokeWidth={1} />
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No activity found in this segment</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {viewingDetails && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-100">
            <div className="p-10 md:p-14">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h2 className="text-3xl font-black text-black tracking-tighter uppercase italic leading-none">Session Intel</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-3">
                    {viewingDetails.date} • {viewingDetails.time}
                  </p>
                </div>
                <button onClick={() => setViewingDetails(null)} className="p-3 bg-slate-50 rounded-2xl hover:bg-black hover:text-white transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-8">
                {/* Venue Info Box */}
                <div className="p-8 bg-slate-50 border border-slate-100 rounded-4xl">
                  <h4 className="font-black text-black text-xl uppercase tracking-tight mb-6">{viewingDetails.restaurant}</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-[11px] font-black text-slate-600 uppercase tracking-widest">
                      <Phone size={16} className="text-emerald-500" /> {viewingDetails.restaurantPhone}
                    </div>
                    <div className="flex items-center gap-4 text-[11px] font-black text-slate-600 uppercase tracking-widest">
                      <MapPin size={16} className="text-black" /> {viewingDetails.location}, {viewingDetails.city}
                    </div>
                  </div>
                </div>

                {/* Participants List */}
                <div className="space-y-3">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 ml-2">Verified Participants</p>
                  {viewingDetails.participants.map((u, idx) => (
                    <div key={idx} className="flex items-center gap-5 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm ${idx === 0 ? 'bg-black' : 'bg-slate-400'}`}>
                        {u.photo}
                      </div>
                      <div>
                        <h5 className="font-black text-black text-[13px] uppercase tracking-tight">{u.name}</h5>
                        <p className="text-[10px] font-bold text-slate-400 lowercase">{u.email || 'Private Participant'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setViewingDetails(null)}
                className={`w-full mt-12 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-xl transition-all active:scale-95 ${activeTab === 'planned' ? 'bg-black text-white' : 'bg-rose-600 text-white shadow-rose-200'
                  }`}
              >
                Exit Overview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlannedDates;