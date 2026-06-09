import React from 'react';
import { LogOut } from 'lucide-react';
import { useTodoStore } from '../store/todoStore';
import { useAuth } from '../AuthContext.jsx';

export default function Header() {
  const todos = useTodoStore((state) => state.todos);
  const { isAuthenticated, signOut } = useAuth();
  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  
  return (
    <div className="flex justify-between items-end mb-6 sm:mb-8">
      <div className="min-w-0 flex-1 mr-3">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none mb-1 sm:mb-2">Daily Do's</h1>
        <p className="text-[#636E72] font-semibold text-sm sm:text-base">Stay energetic, stay busy!</p>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="bg-[#FFE66D] px-3 sm:px-5 py-1 sm:py-1.5 rounded-full border-2 border-[#2D3436] font-black text-sm sm:text-lg shadow-[2px_2px_0_0_#2D3436] whitespace-nowrap">
          {String(completedCount).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
        </div>
        {isAuthenticated && (
          <button
            onClick={signOut}
            className="flex items-center gap-1 bg-white border-2 border-[#2D3436] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-black text-xs shadow-[2px_2px_0_0_#2D3436] hover:bg-[#FF6B6B] hover:text-white hover:border-[#FF6B6B] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer whitespace-nowrap"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
}
