import React from 'react';

export function PixelSlider({ label, value, onChange, min = 0, max = 100, unit = '%' }) {
  // Calculate percentage for styling the track
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col mb-4">
      <div className="flex justify-between items-baseline mb-2">
        <span className="font-['VT323'] text-2xl text-[color:var(--color-text-primary)]">{label}</span>
        <span className="font-['VT323'] text-xl text-[color:var(--color-text-secondary)]">{value}{unit}</span>
      </div>
      <div className="relative h-6 w-full bg-[#151314] border-4 border-[#1a1113] cursor-pointer"
           onClick={(e) => {
             const rect = e.currentTarget.getBoundingClientRect();
             const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
             const pct = x / rect.width;
             onChange(Math.round(min + (max - min) * pct));
           }}>
        {/* Fill track */}
        <div 
          className="absolute top-0 left-0 h-full bg-[#8a2029] transition-all duration-75"
          style={{ width: `${percentage}%` }}
        />
        {/* Slider Handle */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-8 bg-[#e8e1d3] border-4 border-[#1a1113] shadow-md transition-all duration-75 hover:bg-white"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
        {/* Hidden native input for accessibility and dragging */}
        <input 
          type="range" 
          min={min} 
          max={max} 
          value={value} 
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}
