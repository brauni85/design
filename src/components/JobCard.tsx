import { Calendar, User } from 'lucide-react';
import { Job, TeamMember } from '../types';
import { UrgencyBadge } from './UrgencyBadge';
import { formatDeadline } from '../services/jobService';

interface JobCardProps {
  job: Job;
  member: TeamMember | undefined;
  onClick: (job: Job) => void;
}

const statusLabels: Record<string, string> = {
  'offen': 'Offen',
  'in-arbeit': 'In Arbeit',
  'review': 'Review',
  'fertig': 'Fertig',
};

const statusColors: Record<string, string> = {
  'offen': 'bg-gray-100 text-gray-600',
  'in-arbeit': 'bg-blue-100 text-blue-700',
  'review': 'bg-amber-100 text-amber-700',
  'fertig': 'bg-emerald-100 text-emerald-700',
};

const priorityBorderColors: Record<string, string> = {
  red: 'border-l-red-600',
  amber: 'border-l-amber-500',
  green: 'border-l-emerald-500',
};

export function JobCard({ job, member, onClick }: JobCardProps) {
  const isOverdue = job.abgabe < new Date() && job.status !== 'fertig';

  return (
    <div
      onClick={() => onClick(job)}
      className={`
        bg-white rounded-lg border-l-4 ${priorityBorderColors[job.priority]}
        shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer
        border border-gray-100 p-3 mb-2 group
      `}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          {job.auftraggeber}
        </span>
        <UrgencyBadge priority={job.priority} size="sm" />
      </div>

      <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-red-700 transition-colors">
        {job.aufgabe}
      </h3>

      {job.briefing && (
        <p className="text-xs text-gray-500 line-clamp-2 mb-2">{job.briefing}</p>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
        <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
          <Calendar size={11} />
          <span>{formatDeadline(job.abgabe)}</span>
          {isOverdue && <span className="text-red-600">(!)</span>}
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${statusColors[job.status]}`}>
            {statusLabels[job.status]}
          </span>
          {member && (
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
              style={{ backgroundColor: member.color }}
              title={member.name}
            >
              {member.initials}
            </div>
          )}
          {!member && <User size={14} className="text-gray-400" />}
        </div>
      </div>
    </div>
  );
}
