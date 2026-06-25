import { Job, TeamMember } from '../types';
import { JobCard } from './JobCard';

interface PersonColumnProps {
  member: TeamMember;
  jobs: Job[];
  allMembers: TeamMember[];
  onJobClick: (job: Job) => void;
}

export function PersonColumn({ member, jobs, allMembers, onJobClick }: PersonColumnProps) {
  const redJobs = jobs.filter((j) => j.priority === 'red');
  const amberJobs = jobs.filter((j) => j.priority === 'amber');
  const greenJobs = jobs.filter((j) => j.priority === 'green');

  return (
    <div className="flex-1 min-w-[260px] max-w-sm">
      {/* Person Header */}
      <div className="mb-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md"
            style={{ backgroundColor: member.color }}
          >
            {member.initials}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{member.name}</h3>
            <p className="text-xs text-gray-500">{member.role}</p>
          </div>
          <div className="ml-auto">
            <span className="text-sm font-bold text-gray-700 bg-gray-100 rounded-full w-7 h-7 flex items-center justify-center">
              {jobs.length}
            </span>
          </div>
        </div>
        {/* Priority breakdown */}
        <div className="flex gap-2 mt-3">
          {redJobs.length > 0 && (
            <span className="flex items-center gap-1 text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block"></span>
              {redJobs.length}
            </span>
          )}
          {amberJobs.length > 0 && (
            <span className="flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
              {amberJobs.length}
            </span>
          )}
          {greenJobs.length > 0 && (
            <span className="flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              {greenJobs.length}
            </span>
          )}
        </div>
      </div>

      {/* Jobs */}
      <div className="space-y-0 min-h-[100px]">
        {jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-300 text-sm">Keine Aufträge</div>
        ) : (
          jobs
            .sort((a, b) => {
              const order = { red: 0, amber: 1, green: 2 };
              return order[a.priority] - order[b.priority];
            })
            .map((job) => (
              <JobCard
                key={job.id}
                job={job}
                member={allMembers.find((m) => m.id === job.assigneeId)}
                onClick={onJobClick}
              />
            ))
        )}
      </div>
    </div>
  );
}
