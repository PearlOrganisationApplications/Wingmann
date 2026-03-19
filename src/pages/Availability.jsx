import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Calendar as CalendarIcon, Clock, X, Loader2, AlertCircle, Trash2, Edit3, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { availabilityApi } from '../api/availabilityApi';

const Availability = () => {
  const [loading, setLoading] = useState(false);
  const [allAvailability, setAllAvailability] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // States for Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);

  // Range Selection States
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);

  // Staging Area
  const [stagedSlots, setStagedSlots] = useState({});
  const [tempTime, setTempTime] = useState('10:00');

  const interviewerId = localStorage.getItem('userId');

  const fetchAvailability = useCallback(async () => {
    if (!interviewerId || interviewerId === "null") return;
    try {
      setLoading(true);
      const res = await availabilityApi.getInterviewerAvailability(interviewerId);
      if (res.data.success) setAllAvailability(res.data.data);
    } catch (err) {
      if (err.response?.status !== 404) toast.error("Failed to load availability");
    } finally { setLoading(false); }
  }, [interviewerId]);

  useEffect(() => { fetchAvailability(); }, [fetchAvailability]);

  // --- DELETE HANDLER ---
  // --- DELETE CONFIRMATION TOAST ---
  const handleDeleteSlot = (slotId) => {
    toast((t) => (
      <div className="flex flex-col gap-4 p-1">
        <div className="flex items-center gap-3">
          <div className="bg-red-100 p-2 rounded-full">
            <AlertCircle size={20} className="text-red-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1F1F2E]">Delete this slot?</p>
            <p className="text-[10px] text-slate-500 font-medium">This action cannot be undone.</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              executeDelete(slotId);
            }}
            className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-100 transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'top-center',
      style: {
        borderRadius: '1.5rem',
        background: '#fff',
        color: '#1F1F2E',
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        padding: '16px',
        border: '1px solid #f1f5f9'
      },
    });
  };

  // --- ACTUAL API EXECUTION ---
  const executeDelete = async (slotId) => {
    const loadingToast = toast.loading("Deleting slot...");
    try {
      setLoading(true);
      const res = await availabilityApi.deleteSlot(interviewerId, slotId);
      if (res.data.success) {
        toast.success("Slot deleted successfully", { id: loadingToast });
        setAllAvailability(res.data.data); // Update the local state
      }
    } catch (err) {
      toast.error("Failed to delete slot", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };
  // --- UPDATE HANDLER ---
  const handleUpdateSlot = async () => {
    try {
      setLoading(true);
      const res = await availabilityApi.updateSlot(interviewerId, editingSlot._id, {
        day: editingSlot.day,
        date: editingSlot.date,
        times: editingSlot.times
      });
      if (res.data.success) {
        toast.success("Slot updated successfully");
        setAllAvailability(res.data.data);
        setIsEditModalOpen(false);
      }
    } catch (err) {
      toast.error("Failed to update slot");
    } finally { setLoading(false); }
  };

  const generateStagedDates = () => {
    if (!startDate || !endDate || selectedDays.length === 0) {
      toast.error("Select range and days first");
      return;
    }
    const newStaged = {};
    let start = new Date(startDate);
    let end = new Date(endDate);
    let temp = new Date(start);
    while (temp <= end) {
      const dayName = temp.toLocaleDateString('en-US', { weekday: 'long' });
      if (selectedDays.includes(dayName)) {
        const dateStr = temp.toISOString().split('T')[0];
        newStaged[dateStr] = [];
      }
      temp.setDate(temp.getDate() + 1);
    }
    setStagedSlots(newStaged);
  };

  const addTimeToDate = (dateStr) => {
    if (stagedSlots[dateStr].includes(tempTime)) {
      toast.error("Time already added");
      return;
    }
    setStagedSlots(prev => ({
      ...prev,
      [dateStr]: [...prev[dateStr], tempTime].sort()
    }));
    const [hours, minutes] = tempTime.split(':').map(Number);
    const nextHour = (hours + 1) % 24;
    setTempTime(`${String(nextHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
  };

  const handleSaveAll = async () => {
    const finalSlots = Object.entries(stagedSlots)
      .filter(([_, times]) => times.length > 0)
      .map(([date, times]) => ({
        date,
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
        times
      }));
    if (finalSlots.length === 0) return toast.error("Please add times");
    try {
      setLoading(true);
      const res = await availabilityApi.setAvailability(interviewerId, { slots: finalSlots });
      if (res.data.success) {
        toast.success("Schedule saved!");
        setIsModalOpen(false);
        setStagedSlots({});
        fetchAvailability();
      }
    } catch (err) { toast.error("Save failed"); } finally { setLoading(false); }
  };

  return (
    <div className="w-full pt-10 px-4 md:px-10 pb-20">
      <div className="flex justify-between items-end border-b pb-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold uppercase text-[#1F1F2E]">Availability Control</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage existing or build new</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-black text-white px-6 py-4 rounded-xl font-bold text-[11px] uppercase flex items-center gap-2 shadow-lg">
          <Plus size={18} /> Create Custom Schedule
        </button>
      </div>

      {/* EXISTING SLOTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allAvailability.map((slot) => (
          <div key={slot._id} className="bg-white p-6 rounded-4xl border border-slate-200 shadow-sm relative group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white"><CalendarIcon size={18} /></div>
                <div>
                  <h4 className="font-bold uppercase text-xs">{slot.day}</h4>
                  <p className="text-[10px] font-bold text-slate-400">{new Date(slot.date).toLocaleDateString()}</p>
                </div>
              </div>
              {/* ACTIONS */}
              {/* ACTIONS */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => { setEditingSlot({ ...slot }); setIsEditModalOpen(true); }}
                  className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => handleDeleteSlot(slot._id)} // Calls the confirmation toast
                  className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {slot.times.map((t, idx) => (
                <div key={idx} className="bg-slate-50 border px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-2">
                  <Clock size={12} className="text-emerald-500" /> {t}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL (FOR PUT REQUEST) */}
      {isEditModalOpen && editingSlot && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
            <h2 className="text-xl font-bold uppercase mb-6">Edit Day Schedule</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Times for {editingSlot.day}</label>
                <div className="flex gap-2 mt-2">
                  <input type="time" className="flex-1 p-3 border rounded-xl font-bold text-sm" value={tempTime} onChange={(e) => setTempTime(e.target.value)} />
                  <button onClick={() => {
                    if (!editingSlot.times.includes(tempTime)) {
                      setEditingSlot({ ...editingSlot, times: [...editingSlot.times, tempTime].sort() });
                    }
                  }} className="bg-black text-white px-4 rounded-xl"><Plus size={18} /></button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 py-4">
                {editingSlot.times.map(t => (
                  <span key={t} className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                    {t} <X size={12} className="cursor-pointer text-red-500" onClick={() => setEditingSlot({ ...editingSlot, times: editingSlot.times.filter(time => time !== t) })} />
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 bg-slate-100 rounded-xl font-bold uppercase text-[10px]">Cancel</button>
                <button onClick={handleUpdateSlot} className="flex-1 py-4 bg-emerald-500 text-white rounded-xl font-bold uppercase text-[10px] flex items-center justify-center gap-2">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MODAL (Previous implementation) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-5xl rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold uppercase text-[#1F1F2E]">Granular Slot Builder</h2>
              <button onClick={() => { setIsModalOpen(false); setStagedSlots({}); }} className="p-2 bg-slate-50 rounded-xl hover:bg-red-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="flex flex-col lg:flex-row gap-10 overflow-hidden">
              <div className="w-full lg:w-1/3 space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Date Range</label>
                  <input type="date" className="w-full p-4 bg-slate-50 border-2 rounded-2xl font-bold text-[12px]" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  <input type="date" className="w-full p-4 bg-slate-50 border-2 rounded-2xl font-bold text-[12px]" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-4 block">Days to Generate</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <button key={day} onClick={() => setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])}
                        className={`py-3 rounded-xl text-[10px] font-bold uppercase border-2 ${selectedDays.includes(day) ? 'bg-black text-white border-black' : 'bg-white text-slate-400'}`}>
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={generateStagedDates} className="w-full py-5 bg-slate-100 rounded-2xl font-bold uppercase text-[11px]">Step 1: Generate Dates</button>
              </div>

              <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 rounded-[2.5rem] p-6 border">
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-6 text-center">Step 2: Add specific times (+1hr auto-increment)</label>
                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                  {Object.keys(stagedSlots).sort().map(dateStr => (
                    <div key={dateStr} className="p-5 bg-white border rounded-[1.8rem] shadow-sm flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-black uppercase">{new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        <div className="flex items-center gap-2">
                          <input type="time" className="p-2 border-2 rounded-xl text-[11px] font-bold" value={tempTime} onChange={(e) => setTempTime(e.target.value)} />
                          <button onClick={() => addTimeToDate(dateStr)} className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center"><Plus size={20} /></button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {stagedSlots[dateStr].map(t => (
                          <div key={t} className="bg-slate-50 border pl-3 pr-2 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-3">
                            {t} <button onClick={() => setStagedSlots({ ...stagedSlots, [dateStr]: stagedSlots[dateStr].filter(x => x !== t) })}><X size={12} className="text-red-500" /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={handleSaveAll} disabled={loading || Object.keys(stagedSlots).length === 0}
                  className="w-full mt-6 py-6 bg-emerald-500 text-white rounded-[1.8rem] font-bold uppercase text-[12px] shadow-xl disabled:bg-slate-200">
                  {loading ? <Loader2 className="animate-spin" /> : 'Final Step: Save Custom Schedule'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Availability;