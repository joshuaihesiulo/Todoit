import React from 'react';
import { Check, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: todo.id,
    disabled: todo.completed,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const today = new Date(new Date().toDateString());
  const due = todo.dueDate ? new Date(todo.dueDate + 'T00:00:00') : null;
  const isOverdue = !todo.completed && due && due < today;

  const formatDueDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    const diff = Math.round((d - today) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Due Today';
    if (diff === 1) return 'Due Tomorrow';
    if (diff === -1) return 'Due Yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 sm:gap-4 border-2 border-[#2D3436] p-3 sm:p-4 rounded-2xl sm:rounded-3xl transition-all ${
        todo.completed 
          ? 'bg-[#F9F9F9] opacity-60 text-[#B2BEC3] border-[#2D3436]/50' 
          : isOverdue
            ? 'bg-white shadow-[4px_4px_0_0_#2D3436] border-l-[6px] border-l-[#FF6B6B]'
            : 'bg-white shadow-[4px_4px_0_0_#2D3436]'
      }`}
    >
      {!todo.completed && (
        <button
          type="button"
          {...listeners}
          {...attributes}
          className="text-[#2D3436]/30 hover:text-[#2D3436] cursor-grab active:cursor-grabbing transition-colors shrink-0 flex items-center justify-center p-0.5"
        >
          <GripVertical size={18} strokeWidth={2.5} />
        </button>
      )}

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
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
            todo.completed ? 'bg-slate-100 text-slate-400 border-slate-300' : labelColors[todo.type]
          }`}>
            {todo.type}
          </span>
          {todo.dueDate && (
            <span className={`text-[9px] font-black tracking-wider ${isOverdue && !todo.completed ? 'text-[#FF6B6B]' : 'text-[#636E72]'}`}>
              {formatDueDate(todo.dueDate)}
            </span>
          )}
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