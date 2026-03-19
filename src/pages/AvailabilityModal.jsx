import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, CheckCircle2, Loader2, ExternalLink, User } from 'lucide-react';
import { availabilityApi } from '../api/availabilityApi';
import toast from 'react-hot-toast';

const AvailabilityModal = ({ isOpen, onClose, availability, name, interviewerId }) => {
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookedData, setBookedData] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loadingUsers, setLoadingUsers] = useState(false);

    // Fetch users when modal opens
    useEffect(() => {
        if (isOpen) {
            const fetchUsers = async () => {
                setLoadingUsers(true);
                try {
                    const res = await availabilityApi.getUsers();
                    const allUsers = res.data.data || res.data;
                    // Filter: Only show users with role "pass" (not interviewers)
                    const filtered = allUsers.filter(u => u.role === 'user');
                    setUsers(filtered);
                } catch (err) {
                    toast.error("Failed to load users list");
                } finally {
                    setLoadingUsers(false);
                }
            };
            fetchUsers();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBookSlot = async (slot, time) => {
        if (!selectedUser) {
            toast.error("Please select a user first");
            return;
        }

        setBookingLoading(true);
        try {
            const payload = {
                userName: selectedUser.name,
                userEmail: selectedUser.email,
                day: slot.day,
                date: slot.date,
                time: time
            };

            const res = await availabilityApi.bookSlot(interviewerId, payload);
            if (res.data.success) {
                setBookedData(res.data.data);
                toast.success(`Slot booked for ${selectedUser.name}`);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Booking failed");
        } finally {
            setBookingLoading(false);
        }
    };

    if (bookedData) {
        return (
            <div className="fixed inset-0 z-120 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 text-center animate-in zoom-in-95">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={40} /></div>
                    <h2 className="text-2xl font-bold uppercase">Confirmed</h2>
                    <div className="bg-slate-50 p-5 rounded-2xl my-6 text-left border">
                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">Google Meet Link</p>
                        <code className="text-[11px] font-bold text-blue-600 break-all">{bookedData.meetLink}</code>
                    </div>
                    <div className="flex flex-col gap-3">
                        <a href={bookedData.meetLink} target="_blank" rel="noreferrer" className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold uppercase text-[10px] flex items-center justify-center gap-2">Join Now <ExternalLink size={14} /></a>
                        <button onClick={() => { setBookedData(null); onClose(); setSelectedUser(null); }} className="w-full py-4 bg-black text-white rounded-xl font-bold uppercase text-[10px]">Close</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold uppercase text-[#1F1F2E]">{name}{"'s"} Schedule</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Select a user then pick a slot</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-slate-50 rounded-lg hover:bg-red-500 hover:text-white transition-all"><X size={20} /></button>
                </div>

                {/* USER SELECTION DROPDOWN */}
                <div className="mb-8 p-6 bg-blue-50/50 border border-blue-100 rounded-3xl">
                    <label className="text-[9px] font-bold text-blue-400 uppercase tracking-widest block mb-3 ml-1">Assign To User (Role: Pass)</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
                        <select
                            className="w-full pl-12 pr-6 py-4 bg-white border border-blue-100 rounded-xl text-[11px] font-bold uppercase outline-none focus:ring-2 ring-blue-500/20 appearance-none"
                            onChange={(e) => {
                                const user = users.find(u => u._id === e.target.value);
                                setSelectedUser(user);
                            }}
                            defaultValue=""
                        >
                            <option value="" disabled>{loadingUsers ? "Loading users..." : "Select a User"}</option>
                            {users.map(u => (
                                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* SLOTS LIST */}
                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    {availability && availability.length > 0 ? availability.map((slot) => (
                        <div key={slot._id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <div className="flex items-center gap-3 mb-4">
                                <Calendar size={16} className="text-black" />
                                <p className="text-sm font-bold">{slot.day} - {new Date(slot.date).toDateString()}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {slot.times.map((t, idx) => (
                                    <button
                                        key={idx}
                                        disabled={!selectedUser}
                                        onClick={() => handleBookSlot(slot, t)}
                                        className={`px-4 py-2 border rounded-xl text-[11px] font-bold transition-all ${selectedUser
                                            ? "bg-white border-slate-200 hover:border-emerald-500 hover:bg-emerald-50"
                                            : "bg-slate-100 border-transparent text-slate-300 cursor-not-allowed"
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )) : <div className="text-center py-10 font-bold uppercase text-slate-400 text-[10px]">No Availability Set</div>}
                </div>
            </div>
            {(bookingLoading || loadingUsers) && (
                <div className="absolute inset-0 z-130 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                    <Loader2 className="animate-spin" size={40} />
                </div>
            )}
        </div>
    );
};

export default AvailabilityModal;