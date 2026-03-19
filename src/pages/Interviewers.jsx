import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getInterviewers, getInterviewerAvailability } from '../api/interviewerApi';
import AvailabilityModal from './AvailabilityModal';
import WingmatesSignUp from './WingmatesSignUp';
import { UserPlus, Mail, Loader2, ClipboardList, Clock } from 'lucide-react';

const Interviewers = () => {
  const [interviewers, setInterviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [availModalOpen, setAvailModalOpen] = useState(false);
  const [selectedInterviewer, setSelectedInterviewer] = useState(null);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [fetchingAvail, setFetchingAvail] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const data = await getInterviewers();
      setInterviewers(data);
    } catch (e) { toast.error("Sync failed"); }
    finally { setLoading(false); }
  };

  const handleCardClick = async (person) => {
    setSelectedInterviewer(person);
    setFetchingAvail(true);
    try {
      const data = await getInterviewerAvailability(person._id);
      setAvailabilityData(data || []);
      setAvailModalOpen(true);
    } catch (e) {
      setAvailabilityData([]);
      setAvailModalOpen(true);
    } finally { setFetchingAvail(false); }
  };

  useEffect(() => { fetchList(); }, []);

  return (
    <div className="w-full pt-10 px-4 md:px-10 pb-20 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b pb-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">Partner Directory</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Network Intelligence</p>
        </div>
        <button onClick={() => setIsSignUpOpen(true)} className="bg-black text-white px-6 py-4 rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg hover:bg-slate-900 transition-all">
          <UserPlus size={18} className="inline mr-2" /> Provision Partner
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-black" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {interviewers.map((person) => (
            <div key={person._id} onClick={() => handleCardClick(person)} className="bg-white p-7 rounded-[2.5rem] border hover:shadow-xl transition-all cursor-pointer group">
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-5">{person.name?.[0]}</div>
              <h3 className="font-bold text-lg uppercase mb-4 text-[#1F1F2E]">{person.name}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                  <Mail size={14} className="text-black" /> {person.email}
                </div>
                <div className="text-emerald-600 text-[9px] font-bold uppercase bg-emerald-50 px-3 py-1.5 rounded-full w-fit flex items-center gap-2">
                  <Clock size={12} /> View Availability
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isSignUpOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
          <WingmatesSignUp onClose={() => setIsSignUpOpen(false)} refreshData={fetchList} />
        </div>
      )}

      <AvailabilityModal
        isOpen={availModalOpen}
        onClose={() => setAvailModalOpen(false)}
        availability={availabilityData}
        name={selectedInterviewer?.name}
        interviewerId={selectedInterviewer?._id}
      />

      {fetchingAvail && (
        <div className="fixed inset-0 z-200 flex items-center justify-center bg-white/40 backdrop-blur-sm">
          <Loader2 className="animate-spin text-black" size={40} />
        </div>
      )}
    </div>
  );
};

export default Interviewers;