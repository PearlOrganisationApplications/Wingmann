import React from 'react';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Camera } from 'lucide-react';
import {
  LayoutDashboard, Calendar, Clock, Utensils, LogOut,
  BarChart3, Users, MessageSquare, ChevronRight, UserCheck
} from 'lucide-react';
import LogoImg from '../../assets/logo.png';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const userRole = localStorage.getItem('userRole') || "";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const menuItems = [
    // Admin Only
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/overview', roles: ['admin'] },
    { id: 'demographics', label: 'Demographics', icon: BarChart3, path: '/demographics', roles: ['admin'] },
    { id: 'interviewer-list', label: 'Interviewers', icon: Users, path: '/interviewer-list', roles: ['admin'] },
    { id: 'dates', label: 'Planned Dates', icon: Clock, path: '/dates', roles: ['admin'] },
    { id: 'restaurants', label: 'Restaurants', icon: Utensils, path: '/restaurants', roles: ['admin'] },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, path: '/feedback', roles: ['admin'] },
    { id: 'users', label: 'Users', icon: Users, path: '/users', roles: ['admin'] }, // NEW
    // Interviewer Only
    { id: 'interviewer-overview', label: 'Dashboard', icon: LayoutDashboard, path: '/interviewer-overview', roles: ['interviewer'] },
    { id: 'availability', label: 'My Availability', icon: Clock, path: '/availability', roles: ['interviewer'] },

    // Shared
    { id: 'interviews', label: 'Interviews', icon: Calendar, path: '/interviews', roles: ['admin', 'interviewer'] },
    {
      id: 'facial-attractiveness',
      label: 'Facial Attractiveness',
      icon: Camera, // Make sure to import Camera from 'lucide-react'
      path: '/facial-attractiveness',
      roles: ['admin']
    },
  ];

  const filteredMenuItems = menuItems.filter(item => item?.roles?.includes(userRole));

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-slate-950/60 z-40 lg:hidden backdrop-blur-md" onClick={() => setIsOpen(false)} />}

      <aside className={`fixed left-0 top-0 h-screen w-72 bg-[#1F1F2E] border-r border-slate-800/60 flex flex-col z-50 transition-all duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-8 py-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center p-2.5">
              <img src={LogoImg} alt="Logo" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-white tracking-tight">WingMann</span>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">{userRole === 'admin' ? 'Administrator' : 'Interviewer'}</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {filteredMenuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all
                ${isActive ? 'bg-white/10 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}
              `}
            >
              <item.icon size={20} />
              <span className="text-[15px] font-medium">{item.label}</span>
              {window.location.pathname === item.path && <ChevronRight size={14} className="ml-auto opacity-50" />}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-white/5 text-slate-300 rounded-2xl hover:bg-red-500/20 hover:text-red-400 transition-all">
            <LogOut size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;