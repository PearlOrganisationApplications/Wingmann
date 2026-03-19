import React, { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare, Search, Star, MoreVertical,
  Calendar, ArrowUpRight, TrendingUp, Smile, Frown, Meh, Loader2,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { getAllFeedback, getFeedbackStats } from '../api/feedback';

const Feedback = () => {
  // Data States
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10); // Records per page

  // Filter States
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchFeedbackData = useCallback(async (page) => {
    try {
      setLoading(true);
      const feedbackRes = await getAllFeedback(page, limit);

      setFeedbacks(feedbackRes.data);
      setTotalItems(feedbackRes.total);
      setCurrentPage(feedbackRes.page);
    } catch (error) {
      console.error("Error fetching feedback list:", error);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const fetchStatsData = async () => {
    try {
      const statsRes = await getFeedbackStats();
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchStatsData();
    fetchFeedbackData(1);
  }, [fetchFeedbackData]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalItems / limit)) {
      fetchFeedbackData(newPage);
      // Scroll to top of list
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getSentimentDetails = (type) => {
    switch (type) {
      case 'very_good':
        return { label: 'Excellent', icon: <Smile className="text-emerald-500" size={18} />, category: 'Positive' };
      case 'good':
        return { label: 'Good', icon: <Smile className="text-emerald-400" size={18} />, category: 'Positive' };
      case 'average':
        return { label: 'Average', icon: <Meh className="text-amber-500" size={18} />, category: 'Neutral' };
      case 'poor':
      case 'bad':
        return { label: 'Poor', icon: <Frown className="text-rose-500" size={18} />, category: 'Negative' };
      default:
        return { label: 'Neutral', icon: <Meh size={18} />, category: 'Neutral' };
    }
  };

  // Note: Client-side filtering only applies to the current page's results
  const filteredFeedback = feedbacks.filter(item => {
    const { category } = getSentimentDetails(item.type);
    const matchesFilter = filter === 'All' || category === filter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="max-w-7xl mx-auto space-y-10 p-6 bg-white min-h-screen font-sans">

      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">User Feedback</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Sentiment & Experience Analysis</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <StatCard label="Total Responses" value={stats?.totalResponses || 0} icon={MessageSquare} />
          <StatCard label="Avg. Rating" value={stats?.avgRating?.toFixed(1) || 0} icon={Star} />
          <StatCard label="Positive Sentiment" value={`${stats?.positivePercent || 0}%`} icon={TrendingUp} />
        </div>
      </div>

      {/* 2. Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 p-1.5 bg-slate-50 rounded-xl border border-slate-100 w-full md:w-auto">
          {['All', 'Positive', 'Neutral', 'Negative'].map((opt) => (
            <button
              key={opt}
              onClick={() => { setFilter(opt); setCurrentPage(1); }}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === opt ? 'bg-black text-white shadow-lg' : 'text-slate-400 hover:text-black'
                }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="SEARCH CURRENT PAGE..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:border-black outline-none transition-all uppercase tracking-widest"
          />
        </div>
      </div>

      {/* 3. Feedback List */}
      <div className="relative min-h-100">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <Loader2 className="animate-spin text-slate-900" size={32} />
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4">
          {filteredFeedback.map((item) => {
            const sentiment = getSentimentDetails(item.type);
            return (
              <div key={item._id} className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-xl hover:border-slate-200 transition-all group">
                <div className="flex flex-col md:flex-row justify-between gap-6">

                  {/* User Info & Rating */}
                  <div className="flex gap-4 min-w-60">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black shrink-0 border border-slate-200 uppercase">
                      {item.name[0]}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Verified Identity</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < item.rating ? 'fill-black text-black' : 'text-slate-200'}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1 bg-slate-50/50 p-5 rounded-2xl border border-slate-50 relative">
                    <div className="flex items-center gap-2 mb-2">
                      {sentiment.icon}
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{sentiment.label}</span>
                    </div>
                    <p className="text-slate-600 text-sm font-medium leading-relaxed italic">"{item.message}"</p>
                  </div>

                  {/* Date & Actions */}
                  <div className="flex md:flex-col justify-between items-end min-w-30">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar size={12} />
                      <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                        {item.date}
                      </span>
                    </div>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-black">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {!loading && filteredFeedback.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400 font-black uppercase tracking-widest">No feedback found</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Pagination Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-slate-100 gap-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Showing <span className="text-slate-900">{feedbacks.length}</span> of {totalItems} Responses
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              // Simple logic to show current, first, last, and neighbors
              if (pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === pageNum
                      ? 'bg-black text-white shadow-lg'
                      : 'text-slate-400 hover:bg-slate-50 border border-transparent hover:border-slate-200'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                return <span key={pageNum} className="px-1 text-slate-300">...</span>;
              }
              return null;
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, trend }) => (
  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl min-w-40">
    <div className="flex justify-between items-start mb-2">
      <Icon size={16} className="text-slate-400" />
      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center">
        <ArrowUpRight size={10} /> {trend}
      </span>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <p className="text-xl font-black text-slate-900 mt-0.5">{value}</p>
  </div>
);

export default Feedback;