import React from 'react';
import { Sparkles } from 'lucide-react';
import Header from './components/Header';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';
import TodoLegend from './components/TodoLegend';
import FilterBar from './components/FilterBar';
import { useTodoStore } from './store/todoStore';
import { useFilterStore } from './store/filterStore'; // FIX 1: was missing — caused crash

export default function App() {
  const todos = useTodoStore((state) => state.todos);
  const clearCompleted = useTodoStore((state) => state.clearCompleted);
  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  // FIX 2: removed `const addTodo = useTodoStore(...)` — it was unused.
  // TodoForm reads addTodo from the store directly (Part 4 complete).

  const filter = useFilterStore((state) => state.filter);
  const visibleTodos = filter === 'all'
    ? todos
    : todos.filter(t => t.type === filter);

  return (
    <div className="min-h-screen bg-[#FDFCF0] text-[#2D3436] py-6 sm:py-12 px-3 sm:px-4 flex flex-col items-center justify-center font-sans relative overflow-hidden">
      {/* Background ambient decorative shapes from styling sheet */}
      <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-[#FFE66D] rounded-full opacity-60 blur-3xl pointer-events-none hidden sm:block"></div>
      <div className="absolute bottom-[-80px] right-[-80px] w-96 h-96 bg-[#4ECDC4] rounded-full opacity-40 blur-3xl pointer-events-none hidden sm:block"></div>

      <div className="relative w-full max-w-[600px] bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_32px_0_0_#FF6B6B,0_40px_80px_rgba(0,0,0,0.1)] border-4 border-[#2D3436] p-5 sm:p-8 md:p-10 flex flex-col z-10 transition-all">
        
        {/* Header Component */}  
        <Header />

        {/* Input Form with Priority Pickers */}
        <TodoForm />

        {/* Filter Bar — placed between form and list per assignment */}
        <FilterBar />

        {/* Todo List */}
        <div className="space-y-4 min-h-[150px]">
          {visibleTodos.map((todo) => (
            <TodoItem 
              key={todo.id}
              todo={todo}
            />
          ))}

          {visibleTodos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Sparkles className="text-[#FFE66D] mb-1" size={28} />
              <p className="font-extrabold text-[#2D3436] text-base">Perfect peace! No tasks.</p>
              <p className="text-xs text-[#636E72] font-semibold mt-0.5">Type one above to start!</p>
            </div>
          )}
        </div>

        {/* Footer info & action */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t-2 border-[#F1F2F6] flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
          <div className="font-black text-[#2D3436]/60 uppercase tracking-widest font-display">
            {activeCount} ACTIVE ITEM(S)
          </div>
          {completedCount > 0 && (
            <button 
              onClick={clearCompleted}
              className="text-[#FF6B6B] hover:text-[#FF5252] font-black uppercase tracking-widest transition-colors cursor-pointer"
            >
              Clear Completed
            </button>
          )}
        </div>
      </div>
      
      {/* Legend Component */}
      <TodoLegend />
    </div>
  );
}