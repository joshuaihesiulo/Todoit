import React from 'react';
import { Plus } from 'lucide-react';
import { useFormStore } from '../store/formStore';
import { useTodoStore } from '../store/todoStore';

export default function TodoForm() {
  const { text, setText, type, setType, reset } = useFormStore();
  const { addTodo } = useTodoStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text, type);
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <input 
          type="text" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's next on the list?" 
          className="flex-1 bg-[#F1F2F6] border-2 border-[#2D3436] rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 font-bold text-sm sm:text-base placeholder:text-[#B2BEC3] focus:outline-none focus:ring-4 focus:ring-[#4ECDC4]/20 transition-all"
        />
        <button 
          type="submit"
          className="bg-[#FF6B6B] border-2 border-[#2D3436] text-white font-black text-sm px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl shadow-[4px_4px_0_0_#2D3436] active:translate-y-1 active:shadow-none cursor-pointer transition-all flex items-center justify-center gap-1 sm:w-auto"
        >
          <Plus size={16} strokeWidth={3} />
          ADD
        </button>
      </div>

      <div className="flex items-center gap-2 pt-1 flex-wrap">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#2D3436]/55 font-display">Rank Tag:</span>
        {['Urgent', 'Planning', 'Personal'].map((tName) => {
          const colors = {
            Urgent: 'bg-[#FF6B6B] text-white',
            Planning: 'bg-[#4ECDC4] text-[#2D3436]',
            Personal: 'bg-[#FFE66D] text-[#2D3436]'
          };
          const isSelected = type === tName;
          return (
            <button
              key={tName}
              type="button"
              onClick={() => setType(tName)}
              className={`px-3 py-1 rounded-full text-xs font-black border-2 border-[#2D3436] cursor-pointer transition-all ${
                isSelected ? `${colors[tName]} shadow-[2px_2px_0_0_#2D3436]` : 'bg-white text-[#2D3436]/60 hover:bg-slate-50'
              }`}
            >
              {tName}
            </button>
          );
        })}
      </div>
    </form>
  );
}
