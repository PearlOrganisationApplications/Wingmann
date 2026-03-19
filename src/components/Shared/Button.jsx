export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-[#632281] text-white hover:bg-[#4d1a64]',
    outline: 'border-2 border-[#632281] text-[#632281] hover:bg-purple-50',
    ghost: 'text-gray-500 hover:bg-gray-100'
  };
  return (
    <button className={`px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};