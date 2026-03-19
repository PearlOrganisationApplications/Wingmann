export const Input = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-1.5 w-full">
    {label && <label className="text-xs font-bold text-black-400 uppercase ml-1">{label}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-3.5 text-gray-400" size={18} />}
      <input 
        className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3 rounded-xl border border-purple-200 focus:border-[#632281] focus:ring-2 focus:ring-purple-100 outline-none transition-all`} 
        {...props} 
      />
    </div>
  </div>
);