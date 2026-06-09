import React from 'react';
import { Check } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useTodoStore } from '../store/todoStore';

// FIX 4: `labelColors` was used in JSX but never defined — this caused a
// ReferenceError crash at runtime. Defined it here to match the color system
// used in TodoForm's Rank Tag buttons.
const labelColors = {
  Urgent:   'bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]',
  Planning: 'bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]',
  Personal: 'bg-[#FFE66D]/30 text-[#B8860B] border-[#FFE66D]',
};

export default function TodoItem({ todo }) {
  const { user } = useAuth();
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);

  return (
    <div 
      className={`flex items-center gap-3 sm:gap-4 border-2 border-[#2D3436] p-3 sm:p-4 rounded-2xl sm:rounded-3xl transition-all ${
        todo.completed 
          ? 'bg-[#F9F9F9] opacity-60 text-[#B2BEC3] border-[#2D3436]/50' 
          : 'bg-white shadow-[4px_4px_0_0_#2D3436]'
      }`}
    >
      <button
        type="button"
        onClick={() => toggleTodo(todo.id, user)}
        className={`w-8 h-8 rounded-lg border-2 border-[#2D3436] cursor-pointer transition-all flex items-center justify-center shrink-0 ${
          todo.completed ? 'bg-[#4ECDC4]' : 'bg-white hover:bg-[#FFE66D]/20'
        }`}
      >
        {todo.completed && <Check size={16} strokeWidth={4} className="text-white" />}
      </button>

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <span 
          onClick={() => toggleTodo(todo.id, user)}
          className={`font-bold text-base md:text-lg break-words select-none cursor-pointer ${
            todo.completed ? 'line-through text-[#B2BEC3]' : 'text-[#2D3436]'
          }`}
        >
          {todo.text}
        </span>
        <div className="flex">
          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
            todo.completed ? 'bg-slate-100 text-slate-400 border-slate-300' : labelColors[todo.type]
          }`}>
            {todo.type}
          </span>
        </div>
      </div>

      <button 
        type="button"
        onClick={() => deleteTodo(todo.id, user)}
        className="text-[#FF6B6B] hover:text-[#FF5252] font-black cursor-pointer px-1.5 py-1 text-lg transition-transform active:scale-90"
      >
        ✕
      </button>
    </div>
  );
}