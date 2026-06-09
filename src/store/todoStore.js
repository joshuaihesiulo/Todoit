import { create } from 'zustand';
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';

const GUEST_STORAGE_KEY = 'guest_todos';

export const useTodoStore = create((set, get) => ({
  todos: [],

  setTodos: (todos) => set({ todos }),

  addTodo: (text, type, user, dueDate = '') => {
    const existing = get().todos;
    const maxOrder = existing.reduce((max, t) => Math.max(max, t.order ?? -1), -1);
    if (user) {
      return addDoc(collection(db, 'todos'), {
        text,
        type,
        dueDate,
        completed: false,
        userId: user.uid,
        order: maxOrder + 1,
      });
    }
    const newTodo = { id: Date.now(), text, completed: false, type, dueDate, order: maxOrder + 1 };
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

  reorderTodos: (updates, user) => {
    if (user) {
      const batch = writeBatch(db);
      updates.forEach(({ id, order }) => {
        batch.update(doc(db, 'todos', id), { order });
      });
      return batch.commit();
    }
    set((state) => {
      const updated = state.todos.map((t) => {
        const u = updates.find((u) => u.id === t.id);
        return u ? { ...t, order: u.order } : t;
      });
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
