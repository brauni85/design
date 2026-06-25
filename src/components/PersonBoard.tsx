import { Job, TeamMember } from '../types';
import { JobCard } from './JobCard';
import { formatDeadlineShort } from '../services/jobService';

interface PersonBoardProps {
  jobs: Job[];
  members: TeamMember[];
  onJobClick: (job: Job) => void;
}

export function PersonBoard({ jobs, members, onJobClick }: PersonBoardProps) {
  const jobsForMember = (memberId: string) =>
    jobs
      .filter((j) => j.assigneeId === memberId)
      .sort((a, b) => {
        const order = { red: 0, amber: 1, green: 2 };
        if (order[a.priority] !== order[b.priority]) return order[a.priority] - order[b.priority];
        return a.abgabe.getTime() - b.abgabe.getTime();
      });

  const totalHours = (member: TeamMember) => {
    const workDaysCount = member.workDays?.length ?? 5;
    return workDaysCount * 8;
  };

  return (
    <div className="flex gap-4 min-h-0 h-full">
      {members.map((member) => {
        const memberJobs = jobsForMember(member.id);
        const urgent = memberJobs.filter((j) => j.priority === 'red').length;

        return (
          <div key={member.id} className="flex-1 min-w-[200px]">
            {/* Member header */}
            <div
              className="px-3 py-2.5 rounded-t-lg flex items-center gap-2.5"
              style={{ backgroundColor: member.color }}
            >
              <div className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                {member.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-white font-bold text-sm leading-tight truncate">{member.name}</div>
                <div className="text-white/70 text-[10px] truncate">{member.role}</div>
              </div>
              <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                <span className="text-white font-black text-lg leading-none">{memberJobs.length}</span>
                {urgent > 0 && (
                  <span className="bg-white text-red-600 text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    {urgent} DRINGEND
                  </span>
                )}
              </div>
            </div>

            {/* Workload bar */}
            <div className="px-2 py-1.5 bg-gray-50 border-x border-gray-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-gray-500 font-medium">Kapazität diese Woche</span>
                <span className="text-[10px] text-gray-500">{totalHours(member)}h</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (memberJobs.length / 5) * 100)}%`,
                    backgroundColor: member.color,
                  }}
                />
              </div>
            </div>

            {/* Jobs */}
            <div className="bg-white rounded-b-lg border border-t-0 border-gray-200 p-2 overflow-y-auto max-h-[calc(100vh-230px)] scrollbar-thin">
              {memberJobs.length === 0 ? (
                <div className="py-10 text-center text-gray-300 text-xs">Keine Jobs diese Woche</div>
              ) : (
                memberJobs.map((job) => (
                  <div key={job.id} className="relative">
                    <div className="text-[10px] text-gray-400 pl-1 mb-0.5 font-medium">
                      {formatDeadlineShort(job.abgabe)}
                    </div>
                    <JobCard job={job} member={member} onClick={onJobClick} />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
