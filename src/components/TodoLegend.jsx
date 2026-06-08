import React from 'react';

export default function TodoLegend() {
  return (
    <div className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-4 sm:gap-6">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#FF6B6B] border-2 border-[#2D3436]"></div>
        <span className="font-black text-xs uppercase tracking-wider text-[#2D3436]">Urgent</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#4ECDC4] border-2 border-[#2D3436]"></div>
        <span className="font-black text-xs uppercase tracking-wider text-[#2D3436]">Planning</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#FFE66D] border-2 border-[#2D3436]"></div>
        <span className="font-black text-xs uppercase tracking-wider text-[#2D3436]">Personal</span>
      </div>
    </div>
  );
}
