import React, { useState, useEffect } from 'react';
import {
    Video, X, CheckCircle2, MapPin, Wind,
    CloudMoon, Activity, Calendar as CalendarIcon,
    UserCheck, AlertCircle, Loader2, BookOpen, MoreVertical
} from 'lucide-react';
import { interviewApi } from '../api/interviewApi';

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-5 right-5 left-5 md:left-auto md:top-10 md:right-10 z-110 animate-in slide-in-from-top-5 md:slide-in-from-right-10 duration-300">
            <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                {type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <p className="font-bold text-sm">{message}</p>
            </div>
        </div>
    );
};

const Interviews = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [selectedDate, setSelectedDate] = useState('All');

    const [showDetail, setShowDetail] = useState(false);
    const [detailData, setDetailData] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const [rejectingUser, setRejectingUser] = useState(null);
    const [rejectionComment, setRejectionComment] = useState('');

    const userRole = localStorage.getItem('userRole');
    const currentUserName = localStorage.getItem('userName') || "Interviewer";

    const [loadingId, setLoadingId] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await interviewApi.getBookings();
            if (response.success) setBookings(response.data || []);
        } catch (error) {
            showNotify('Failed to load bookings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDetail = async (id) => {
        try {
            setDetailLoading(true);
            setShowDetail(true);
            const response = await interviewApi.getInterviewDetail(id);
            if (response.success) {
                setDetailData(response.inteview);
            }
        } catch (error) {
            showNotify('Failed to load details', 'error');
            setShowDetail(false);
        } finally {
            setDetailLoading(false);
        }
    };

    const showNotify = (msg, type = 'success') => setNotification({ msg, type });

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    };

    const filteredData = bookings.filter(item => {
        if (selectedDate === 'All') return true;
        return formatDate(item.date) === selectedDate;
    });

    const uniqueDates = ['All', ...new Set(bookings.map(item => formatDate(item.date)))];

    const handleApprove = async (id) => {
        try {
        //    setActionLoading(true);
               setLoadingId(id)
            const res = await interviewApi.updateBookingStatus(id, 'accepted');
            if (res.success) {
                showNotify('Interview Approved successfully', 'success');
                fetchBookings();
            }
        } catch (error) {
            showNotify(error.message || 'Approval failed', 'error');
        } finally {
            setLoadingId(null)
        }
    };

    const handleConfirmReject = async () => {
        if (!rejectionComment.trim()) return showNotify('Reason is mandatory', 'error');
        try {
            // setActionLoading(true);
             setLoadingId(id)
            const res = await interviewApi.updateBookingStatus(rejectingUser._id, 'rejected', rejectionComment);
            if (res.success) {
                showNotify(`Rejected ${rejectingUser.userName}`, 'success');
                setRejectingUser(null);
                setRejectionComment('');
                fetchBookings();
            }
        } catch (error) {
            showNotify(error.message || 'Rejection failed', 'error');
        } finally {
            // setActionLoading(false);
             setLoadingId(null)
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-slate-500 animate-pulse">Loading pipeline...</div>;

    return (
        <div className="relative md:pt-4 pb-20 bg-slate-50/50 min-h-screen space-y-6 md:space-y-8 ">
            {notification && <Toast message={notification.msg} type={notification.type} onClose={() => setNotification(null)} />}

            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-slate-200 pb-6 md:pb-8">
                <div className="pt-4">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                        {userRole === 'admin' ? 'Global Pipeline' : 'My Interviews'}
                    </h1>
                    <p className="text-indigo-600 font-bold uppercase text-[9px] md:text-[10px] tracking-[0.3em] mt-1">
                        {userRole === 'admin' ? 'Viewing all system sessions' : `Logged in as ${currentUserName}`}
                    </p>
                </div>

                {/* Date Filter - Scrollable on mobile */}
                <div className="w-full lg:w-auto overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
                    <div className="flex items-center gap-2 md:gap-3 bg-white p-1.5 md:p-2 rounded-2xl border border-slate-200 shadow-sm min-w-max">
                        {uniqueDates.map(date => (
                            <button
                                key={date}
                                onClick={() => setSelectedDate(date)}
                                className={`px-4 md:px-5 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedDate === date ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                            >
                                {date}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- Mobile Card View (Hidden on MD+) --- */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredData.map((booking) => (
                    <div key={booking._id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3" onClick={() => handleOpenDetail(booking._id)}>
                                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                    {booking.userName.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">{booking.userName}</p>
                                    <p className="text-[9px] text-slate-400 font-medium uppercase">{formatDate(booking.date)} • {booking.time}</p>
                                </div>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${booking.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : booking.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                                {booking.status || 'pending'}
                            </span>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button onClick={() => window.open(booking.meetLink, '_blank')} className="flex-1 flex justify-center py-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs"><Video size={16} /></button>
                            <button disabled={actionLoading} onClick={() => setRejectingUser(booking)} className="flex-2 py-2.5 rounded-xl border border-rose-100 text-rose-600 font-bold text-xs">Reject</button>
                            <button disabled={actionLoading} onClick={() => handleApprove(booking._id)} className="flex-2 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs">Approve</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- Desktop Table View (Hidden on SM) --- */}
            <div className="hidden md:block bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/80 border-b border-slate-200">
                        <tr>
                            <th className="px-8 py-5 text-[11px] font-black text-slate-500 uppercase tracking-widest">Candidate</th>
                            <th className="px-8 py-5 text-[11px] font-black text-slate-500 uppercase tracking-widest">Schedule</th>
                            <th className="px-8 py-5 text-[11px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-5 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredData.map((booking) => (
                            <tr key={booking._id} className="group hover:bg-slate-50/50 transition-all duration-300">
                                <td className="px-8 py-6 cursor-pointer" onClick={() => handleOpenDetail(booking._id)}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            {booking.userName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors underline decoration-slate-200 underline-offset-4">{booking.userName}</p>
                                            <p className="text-[10px] text-slate-400 font-medium uppercase">{booking.userEmail}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <CalendarIcon size={16} className="text-indigo-500" />
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">{formatDate(booking.date)}</p>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{booking.time}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${booking.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                                        booking.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {booking.status || 'pending'}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-2.5 cursor-pointer">
                                        <button onClick={() => window.open(booking.meetLink, '_blank')} className="p-3 cursor-pointer bg-indigo-600 text-white rounded-xl shadow-lg hover:-translate-y-0.5 transition-all"><Video size={18} /></button>


                                       
                                        <button disabled={loadingId === booking._id} onClick={() => setRejectingUser(booking)} className="px-5 py-2.5 cursor-pointer rounded-xl border border-rose-200 text-rose-600 font-bold text-xs hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50">Reject</button>
                                        <button disabled={loadingId === booking._id} onClick={() => handleApprove(booking._id)} className="px-5 py-2.5 cursor-pointer bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-emerald-600 transition-all shadow-lg flex items-center gap-2">
                                            {actionLoading ? <Loader2 size={14} className="animate-spin" /> : 'Approve'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- USER DETAIL MODAL --- */}
            {showDetail && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-100 flex items-center justify-center p-4 md:p-8 overflow-y-auto">
                    <div className="bg-white w-full max-w-5xl rounded-4xl md:rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-300 max-h-[90vh]">

                        {detailLoading ? (
                            <div className="w-full h-64 md:h-150 flex items-center justify-center">
                                <Loader2 className="animate-spin text-indigo-600" size={40} />
                            </div>
                        ) : detailData && (
                            <>
                                {/* Left Side: Photo */}
                                <div className="w-full md:w-1/2 relative h-64 md:h-auto overflow-hidden">
                                    <img
                                        src={detailData.userId?.photos?.[0] || 'https://via.placeholder.com/600'}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-4 md:top-8 left-4 md:left-8 bg-white/90 backdrop-blur px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-lg">
                                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-indigo-600">Match Profile</span>
                                    </div>
                                    <button
                                        onClick={() => setShowDetail(false)}
                                        className="absolute top-4 md:top-8 right-4 md:right-8 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-all z-10"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Right Side: Details */}
                                <div className="w-full md:w-1/2 p-6 md:p-14 overflow-y-auto">
                                    <div className="space-y-6 md:space-y-8">
                                        <div>
                                            <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-4">About Candidate</h3>
                                            <div className="flex flex-wrap gap-2 md:gap-3">
                                                <Tag icon={<MapPin size={12} />} text={detailData.userId?.location?.address || 'India'} />
                                                <Tag icon={<Wind size={12} />} text={detailData.userId?.lifestyle?.smoke === 'yes' ? 'Smokes' : 'Non-smoker'} />
                                                <Tag icon={<CloudMoon size={12} />} text={detailData.userId?.religon || 'Hindu'} />
                                                <Tag icon={<Activity size={12} />} text={detailData.userId?.lifestyle?.exercise || 'Regularly'} />
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-3">My Story</h3>
                                            <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
                                                {detailData.userId?.story || "No story provided yet."}
                                            </p>
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Gallery</h3>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 md:gap-4">
                                                {detailData.userId?.photos?.slice(0, 3).map((photo, i) => (
                                                    <div key={i} className="aspect-square rounded-xl md:rounded-3xl overflow-hidden border-2 md:border-4 border-slate-50 shadow-sm">
                                                        <img src={photo} className="w-full h-full object-cover" alt="Gallery" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Rejection Modal */}
            {rejectingUser && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-200 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl md:rounded-4xl p-6 md:p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg md:text-xl font-black text-slate-900">Rejection Reason</h3>
                            <button onClick={() => setRejectingUser(null)}><X size={20} className="text-slate-400" /></button>
                        </div>
                        <textarea
                            autoFocus
                            value={rejectionComment}
                            onChange={(e) => setRejectionComment(e.target.value)}
                            placeholder="Detail why this profile was rejected..."
                            className="w-full h-32 md:h-40 bg-slate-50 border border-slate-100 rounded-2xl md:rounded-3xl p-4 md:p-5 text-sm text-slate-700 focus:ring-2 focus:ring-rose-100 outline-none resize-none"
                        />
                        <div className="grid grid-cols-2 gap-3 md:gap-4 mt-6">
                            <button onClick={() => setRejectingUser(null)} className="py-3 md:py-4 rounded-xl md:rounded-2xl bg-slate-50 text-slate-500 font-bold text-[10px] md:text-xs uppercase">Cancel</button>
                            <button disabled={actionLoading || !rejectionComment.trim()} onClick={handleConfirmReject} className="py-3 md:py-4 rounded-xl md:rounded-2xl bg-rose-600 text-white font-bold text-[10px] md:text-xs uppercase shadow-lg disabled:bg-slate-300">
                                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : 'Confirm Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper Sub-component for Tags
const Tag = ({ icon, text }) => (
    <div className="flex items-center gap-1.5 md:gap-2 bg-slate-50 border border-slate-100 px-3 md:px-4 py-1.5 md:py-2.5 rounded-xl md:rounded-2xl shadow-sm">
        <span className="text-indigo-400">{icon}</span>
        <span className="text-[10px] md:text-xs font-bold text-slate-600 whitespace-nowrap">{text}</span>
    </div>
);

export default Interviews;