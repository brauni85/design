import { ChevronLeft, ChevronRight, Plus, LayoutGrid, Users } from 'lucide-react';
import { TeamMember, ViewMode } from '../types';
import { getWeekLabel } from '../services/jobService';

interface HeaderProps {
  currentWeekStart: Date;
  viewMode: ViewMode;
  selectedAssignees: string[];
  members: TeamMember[];
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToggleView: () => void;
  onToggleAssignee: (id: string) => void;
  onClearAssignees: () => void;
  onAddJob: () => void;
}

export function Header({
  currentWeekStart,
  viewMode,
  selectedAssignees,
  members,
  onPrevWeek,
  onNextWeek,
  onToggleView,
  onToggleAssignee,
  onClearAssignees,
  onAddJob,
}: HeaderProps) {
  return (
    <header className="bg-vfb-red relative overflow-hidden">
      <div className="absolute inset-0 vfb-stripe pointer-events-none" />
      <div className="relative z-10 px-6 pt-5 pb-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-vfb-red font-black text-sm leading-none">VfB</span>
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight leading-none">JOBBOARD</h1>
              <p className="text-red-200 text-xs font-medium mt-0.5">Design Agentur · Wochenübersicht</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onToggleView}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
            >
              {viewMode === 'week' ? <Users size={14} /> : <LayoutGrid size={14} />}
              {viewMode === 'week' ? 'Personen' : 'Woche'}
            </button>
            <button
              onClick={onAddJob}
              className="flex items-center gap-1.5 bg-white text-vfb-red text-xs font-bold px-4 py-2 rounded-lg hover:bg-red-50 transition-colors shadow-lg"
            >
              <Plus size={14} />
              Auftrag
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <button onClick={onPrevWeek} className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
            <ChevronLeft size={16} />
          </button>
          <span className="text-white font-semibold text-sm">{getWeekLabel(currentWeekStart)}</span>
          <button onClick={onNextWeek} className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {members.map((member) => {
            const isSelected = selectedAssignees.includes(member.id);
            return (
              <button
                key={member.id}
                onClick={() => onToggleAssignee(member.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isSelected ? 'bg-white text-vfb-red shadow-md' : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                  style={{
                    backgroundColor: isSelected ? member.color : 'rgba(255,255,255,0.3)',
                    color: 'white',
                  }}
                >
                  {member.initials}
                </span>
                {member.name.split(' ')[0]}
              </button>
            );
          })}
          {selectedAssignees.length > 0 && (
            <button onClick={onClearAssignees} className="text-xs text-red-200 hover:text-white transition-colors px-2 underline">
              Alle anzeigen
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
