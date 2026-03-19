import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-purple-100 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 animate-in fade-in zoom-in duration-200">
        <div className="px-8 pt-8 pb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-black-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <div className="p-8 pt-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;