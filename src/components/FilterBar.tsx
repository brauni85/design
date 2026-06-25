import { Search } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  statusFilter: string;
  priorityFilter: string;
  onSearchChange: (q: string) => void;
  onStatusChange: (s: string) => void;
  onPriorityChange: (p: string) => void;
}

const statuses = [
  { value: 'alle', label: 'Alle' },
  { value: 'offen', label: 'Offen' },
  { value: 'in-arbeit', label: 'In Arbeit' },
  { value: 'review', label: 'Review' },
  { value: 'fertig', label: 'Fertig' },
];

const priorities = [
  { value: 'alle', label: 'Alle' },
  { value: 'red', label: 'Dringend' },
  { value: 'amber', label: 'Diese Woche' },
  { value: 'green', label: 'Geplant' },
];

export function FilterBar({ searchQuery, statusFilter, priorityFilter, onSearchChange, onStatusChange, onPriorityChange }: FilterBarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex flex-wrap items-center gap-3">
      <div className="relative flex-shrink-0">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Suchen..."
          className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg w-48 focus:outline-none focus:border-red-400"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mr-1">Status:</span>
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => onStatusChange(s.value)}
            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
              statusFilter === s.value
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mr-1">Prio:</span>
        {priorities.map((p) => (
          <button
            key={p.value}
            onClick={() => onPriorityChange(p.value)}
            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
              priorityFilter === p.value
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
