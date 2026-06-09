import { useEffect, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { DndContext, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';
import AuthModal from './components/AuthModal';
import Header from './components/Header';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';
import TodoLegend from './components/TodoLegend';
import FilterBar from './components/FilterBar';
import { useTodoStore } from './store/todoStore';
import { useFilterStore } from './store/filterStore';

export default function App() {
  const { user } = useAuth();
  const todos = useTodoStore((state) => state.todos);
  const setTodos = useTodoStore((state) => state.setTodos);
  const clearCompleted = useTodoStore((state) => state.clearCompleted);
  const loadGuestTodos = useTodoStore((state) => state.loadGuestTodos);
  const reorderTodos = useTodoStore((state) => state.reorderTodos);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'todos'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTodos(items);
      });
      return unsubscribe;
    }
    loadGuestTodos();
  }, [user]);

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  const filter = useFilterStore((state) => state.filter);
  const today = useMemo(() => new Date(new Date().toDateString()), []);
  const isDueToday = (t) => t.dueDate && new Date(t.dueDate + 'T00:00:00').toDateString() === today.toDateString();

  let visibleTodos = filter === 'all'
    ? todos
    : filter === 'due-today'
      ? todos.filter(isDueToday)
      : todos.filter(t => t.type === filter);

  visibleTodos = [...visibleTodos].sort((a, b) => {
    const aOverdue = !a.completed && a.dueDate && new Date(a.dueDate + 'T00:00:00') < today;
    const bOverdue = !b.completed && b.dueDate && new Date(b.dueDate + 'T00:00:00') < today;
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    return (a.order ?? 9999) - (b.order ?? 9999);
  });

  const sortableIds = useMemo(() => visibleTodos.map(t => t.id), [visibleTodos]);

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = visibleTodos.findIndex(t => t.id === active.id);
    const newIndex = visibleTodos.findIndex(t => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(visibleTodos, oldIndex, newIndex);
    const updates = reordered.map((todo, idx) => ({ id: todo.id, order: idx }));
    reorderTodos(updates, user);
  }

  return (
    <>
      <AuthModal />
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
        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
        <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
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
        </SortableContext>
        </DndContext>

        {/* Footer info & action */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t-2 border-[#F1F2F6] flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
          <div className="font-black text-[#2D3436]/60 uppercase tracking-widest font-display">
            {activeCount} ACTIVE ITEM(S)
          </div>
          {completedCount > 0 && (
            <button 
              onClick={() => clearCompleted(user)}
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
    </>
  );
}