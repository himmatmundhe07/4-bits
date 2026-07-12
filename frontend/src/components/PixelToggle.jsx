import React from 'react';

export function PixelToggle({ label, checked, onChange, description }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex flex-col max-w-[75%]">
        <span className="font-['VT323'] text-2xl text-[color:var(--color-text-primary)] cursor-pointer" onClick={() => onChange(!checked)}>
          {label}
        </span>
        {description && (
          <span className="font-['VT323'] text-lg text-[color:var(--color-text-secondary)] leading-tight">
            {description}
          </span>
        )}
      </div>
      
      <button 
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-14 h-8 border-4 border-[#1a1113] relative transition-colors ${checked ? 'bg-[#8a2029]' : 'bg-[#151314]'}`}
      >
        <div 
          className={`absolute top-1/2 -translate-y-1/2 w-4 h-6 bg-[#e8e1d3] border-4 border-[#1a1113] shadow-md transition-all duration-100 ${checked ? 'left-[30px]' : 'left-0'}`}
        />
      </button>
    </div>
  );
}
