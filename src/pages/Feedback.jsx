import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MessageSquare,
  Star,
  TrendingUp,
  Loader2,
} from "lucide-react";

const Feedback = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "https://api.wingmann.online/api/feedback/get"
      );
      setStats(res.data.data);
    } catch (err) {
      console.error("Error fetching feedback stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-10 p-6 bg-white min-h-screen font-sans">

      {/* Header */}
      <div className="border-b border-slate-100 pb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
          User Feedback
        </h1>
        
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">
          Sentiment & Experience Analysis
        </p>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-slate-900" size={32} />
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="flex flex-wrap gap-4">
            <StatCard
              label="Total Responses"
              value={stats?.totalResponses || 0}
              icon={MessageSquare}
            />
            <StatCard
              label="Avg. Rating"
              value={stats?.avgRating || 0}
              icon={Star}
            />
            <StatCard
              label="Positive %"
              value={`${stats?.positivePercent || 0}%`}
              icon={TrendingUp}
            />
          </div>

          {/* Sentiment Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Box title="Positive" value={stats?.positive} color="emerald" />
            <Box title="Neutral" value={stats?.neutral} color="amber" />
            <Box title="Negative" value={stats?.negative} color="rose" />
          </div>

          {/* Rating Distribution */}
          <div className="mt-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="text-sm font-black uppercase text-slate-400 mb-4">
              Rating Distribution
            </h3>

            <div className="space-y-3">
              {Object.entries(stats?.ratingDistribution || {}).map(
                ([rating, count]) => (
                  <div key={rating} className="flex items-center gap-4">
                    <span className="text-xs font-bold w-10">
                      {rating} ★
                    </span>
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black"
                        style={{
                          width: `${
                            stats.totalResponses
                              ? (count / stats.totalResponses) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold">{count}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* Stat Card */
const StatCard = ({ label, value, icon: Icon }) => (
  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl min-w-40">
    <Icon size={16} className="text-slate-400 mb-2" />
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
      {label}
    </p>
    <p className="text-xl font-black text-slate-900 mt-1">{value}</p>
  </div>
);

/* Small Box */
const Box = ({ title, value, color }) => (
  <div className={`bg-${color}-50 border border-${color}-100 p-5 rounded-2xl`}>
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
      {title}
    </p>
    <p className={`text-2xl font-black text-${color}-600 mt-2`}>
      {value || 0}
    </p>
  </div>
);

export default Feedback;