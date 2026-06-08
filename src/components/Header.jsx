import React from 'react';
import { useTodoStore } from '../store/todoStore';

export default function Header() {
  const todos = useTodoStore((state) => state.todos);
  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  
  return (
    <div className="flex justify-between items-end mb-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-2">Daily Do's</h1>
        <p className="text-[#636E72] font-semibold text-base">Stay energetic, stay busy!</p>
      </div>
      <div className="bg-[#FFE66D] px-5 py-1.5 rounded-full border-2 border-[#2D3436] font-black text-lg shadow-[2px_2px_0_0_#2D3436]">
        {String(completedCount).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
      </div>
    </div>
  );
}
