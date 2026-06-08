import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// FIX 5: The `persist` options object `{ name: 'basic_todos' }` was passed as
// the second argument to `create()` instead of as the second argument to
// `persist()`. `create()` only takes one argument. This meant persist had no
// storage key, so data was never actually saved to localStorage.
//
// Wrong:  create(persist((set) => ({...})), { name: 'basic_todos' })
// Right:  create(persist((set) => ({...}), { name: 'basic_todos' }))

export const useTodoStore = create(
  persist(
    (set) => ({
      todos: [
        { id: 1, text: 'Buy fresh coffee beans', completed: true, type: 'Urgent' },
        { id: 2, text: 'Design the mobile interface mockup', completed: false, type: 'Planning' },
        { id: 3, text: 'Call Sarah for project sync', completed: false, type: 'Personal' },
      ],

      addTodo: (text, type) =>
        set((state) => ({
          todos: [...state.todos, { id: Date.now(), text, completed: false, type }],
        })),

      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),

      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((t) => t.id !== id),
        })),

      clearCompleted: () =>
        set((state) => ({
          todos: state.todos.filter((t) => !t.completed),
        })),
    }),
    { name: 'basic_todos' } 
  )
);