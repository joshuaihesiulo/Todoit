import { useFilterStore } from "../store/filterStore";

export default function FilterBar() {
  const filter = useFilterStore((state) => state.filter);
  const setFilter = useFilterStore((state) => state.setFilter);

  const filters = [
    { label: 'All',       value: 'all',       activeClass: 'bg-[#2D3436] text-white' },
    { label: 'Due Today', value: 'due-today', activeClass: 'bg-[#FF6B6B] text-white' },
    { label: 'Urgent',    value: 'Urgent',    activeClass: 'bg-[#FF6B6B] text-white' },
    { label: 'Planning',  value: 'Planning',  activeClass: 'bg-[#4ECDC4] text-[#2D3436]' },
    { label: 'Personal',  value: 'Personal',  activeClass: 'bg-[#FFE66D] text-[#2D3436]' },
  ];

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 mb-6 flex-wrap">
      <span className="text-[10px] font-black uppercase tracking-wider text-[#2D3436]/55 font-display shrink-0">
        Filter:
      </span>
      {filters.map(({ label, value, activeClass }) => {
        const isActive = filter === value;
        return (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-3 py-1 rounded-full text-xs font-black border-2 border-[#2D3436] cursor-pointer transition-all ${
              isActive
                ? `${activeClass} shadow-[2px_2px_0_0_#2D3436]`
                : 'bg-white text-[#2D3436]/60 hover:bg-slate-50'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}