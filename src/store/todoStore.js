import { create } from 'zustand';
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase';

const GUEST_STORAGE_KEY = 'guest_todos';

export const useTodoStore = create((set, get) => ({
  todos: [],

  setTodos: (todos) => set({ todos }),

  addTodo: (text, type, user) => {
    if (user) {
      return addDoc(collection(db, 'todos'), {
        text,
        type,
        completed: false,
        userId: user.uid,
      });
    }
    const newTodo = { id: Date.now(), text, completed: false, type };
    set((state) => {
      const updated = [...state.todos, newTodo];
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updated));
      return { todos: updated };
    });
  },

  toggleTodo: (id, user) => {
    if (user) {
      const todo = get().todos.find((t) => t.id === id);
      if (todo) {
        return updateDoc(doc(db, 'todos', id), { completed: !todo.completed });
      }
      return;
    }
    set((state) => {
      const updated = state.todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updated));
      return { todos: updated };
    });
  },

  deleteTodo: (id, user) => {
    if (user) {
      return deleteDoc(doc(db, 'todos', id));
    }
    set((state) => {
      const updated = state.todos.filter((t) => t.id !== id);
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updated));
      return { todos: updated };
    });
  },

  clearCompleted: (user) => {
    if (user) {
      const completed = get().todos.filter((t) => t.completed);
      return Promise.all(completed.map((t) => deleteDoc(doc(db, 'todos', t.id))));
    }
    set((state) => {
      const updated = state.todos.filter((t) => !t.completed);
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updated));
      return { todos: updated };
    });
  },

  loadGuestTodos: () => {
    const stored = localStorage.getItem(GUEST_STORAGE_KEY);
    const todos = stored ? JSON.parse(stored) : [];
    set({ todos });
  },
}));
