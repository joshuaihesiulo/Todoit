import { useEffect, useRef, useState, useCallback } from 'react';
import { useTodoStore } from '../store/todoStore';

const CHECK_INTERVAL = 60000;
const CORAL_ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%23FF6B6B'/%3E%3Ctext x='50' y='72' font-size='60' text-anchor='middle' fill='white'%3E%E2%98%80%3C/text%3E%3C/svg%3E";

export default function useNotifications() {
  const todos = useTodoStore((state) => state.todos);
  const todosRef = useRef(todos);
  todosRef.current = todos;

  const notifiedIds = useRef(new Set());
  const [toasts, setToasts] = useState([]);
  const [permRequested, setPermRequested] = useState(false);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const hasDue = todos.some((t) => t.dueDate);
    if (hasDue && !permRequested && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
      setPermRequested(true);
    }
  }, [todos, permRequested]);

  useEffect(() => {
    const check = () => {
      if (!('Notification' in window)) return;
      const currentTodos = todosRef.current;
      if (!currentTodos || currentTodos.length === 0) return;

      const today = new Date().toDateString();

      currentTodos.forEach((todo) => {
        if (todo.completed || !todo.dueDate || notifiedIds.current.has(todo.id)) return;

        const due = new Date(todo.dueDate + 'T00:00:00');
        if (due.toDateString() !== today) return;

        notifiedIds.current.add(todo.id);

        if (Notification.permission === 'granted') {
          new Notification("Daily Do's — Task Due Soon", {
            body: todo.text,
            icon: CORAL_ICON,
          });
        } else {
          const id = Date.now() + Math.random();
          setToasts((prev) => [...prev, { id, text: todo.text }]);
        }
      });
    };

    check();
    const interval = setInterval(check, CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return { toasts, removeToast };
}
