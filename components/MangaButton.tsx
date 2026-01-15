import React from 'react';

interface MangaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'secondary';
  label: string;
}

export const MangaButton: React.FC<MangaButtonProps> = ({ 
  variant = 'primary', 
  label, 
  className = '', 
  ...props 
}) => {
  let baseStyles = "relative px-6 py-3 font-bold text-xl uppercase transition-transform active:translate-y-1 active:translate-x-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
  
  const colors = {
    primary: "bg-white text-black hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-500",
    secondary: "bg-yellow-400 text-black hover:bg-yellow-300"
  };

  return (
    <button 
      className={`${baseStyles} ${colors[variant]} ${className}`}
      {...props}
    >
      {label}
    </button>
  );
};