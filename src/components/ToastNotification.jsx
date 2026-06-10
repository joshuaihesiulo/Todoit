import { useEffect } from 'react';
import { Bell } from 'lucide-react';

export default function ToastNotification({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-white border-2 border-[#2D3436] rounded-2xl shadow-[4px_4px_0_0_#2D3436] p-4 max-w-sm animate-slide-up">
      <div className="w-8 h-8 rounded-lg bg-[#FF6B6B] flex items-center justify-center shrink-0">
        <Bell size={16} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black uppercase tracking-wider text-[#FF6B6B]">Task Due Today</p>
        <p className="font-bold text-sm text-[#2D3436] truncate">{toast.text}</p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-[#B2BEC3] hover:text-[#2D3436] cursor-pointer shrink-0 transition-colors"
      >
        ✕
      </button>
    </div>
  );
}
