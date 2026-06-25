import { useMemo } from 'react';
import { format, isToday, isSameDay } from 'date-fns';
import { de } from 'date-fns/locale';
import { Job, TeamMember, ViewMode } from '../types';
import { JobCard } from './JobCard';
import { PersonColumn } from './PersonColumn';
import { getWeekDays } from '../services/jobService';

interface WeeklyBoardProps {
  jobs: Job[];
  allJobs: Job[];
  members: TeamMember[];
  viewMode: ViewMode;
  currentWeekStart: Date;
  onJobClick: (job: Job) => void;
}

export function WeeklyBoard({ jobs, allJobs: _allJobs, members, viewMode, currentWeekStart, onJobClick }: WeeklyBoardProps) {
  const weekDays = useMemo(() => getWeekDays(currentWeekStart), [currentWeekStart]);

  if (viewMode === 'person') {
    return (
      <div className="flex gap-4 p-4 overflow-x-auto scrollbar-thin min-h-[calc(100vh-180px)]">
        {members.map((member) => {
          const memberJobs = jobs.filter((j) => j.assigneeId === member.id);
          return (
            <PersonColumn
              key={member.id}
              member={member}
              jobs={memberJobs}
              allMembers={members}
              onJobClick={onJobClick}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex gap-3 p-4 overflow-x-auto scrollbar-thin min-h-[calc(100vh-180px)]">
      {weekDays.map((day) => {
        const dayJobs = jobs.filter((j) => isSameDay(j.abgabe, day));
        const today = isToday(day);
        const isWeekend = day.getDay() === 0 || day.getDay() === 6;

        return (
          <div
            key={day.toISOString()}
            className={`flex-1 min-w-[200px] ${isWeekend ? 'opacity-60' : ''}`}
          >
            <div
              className={`mb-3 p-3 rounded-xl text-center ${
                today
                  ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                  : isWeekend
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-white text-gray-700 shadow-sm'
              }`}
            >
              <div className={`text-xs font-semibold uppercase tracking-wider ${today ? 'text-red-100' : 'text-gray-400'}`}>
                {format(day, 'EEE', { locale: de })}
              </div>
              <div className={`text-2xl font-black ${today ? 'text-white' : 'text-gray-900'}`}>
                {format(day, 'd')}
              </div>
              <div className={`text-xs ${today ? 'text-red-100' : 'text-gray-400'}`}>
                {format(day, 'MMM', { locale: de })}
              </div>
              {dayJobs.length > 0 && (
                <div className={`mt-1 text-xs font-bold ${today ? 'text-white' : 'text-gray-500'}`}>
                  {dayJobs.length} Auftrag{dayJobs.length !== 1 ? 'räge' : ''}
                </div>
              )}
            </div>

            <div className="min-h-[80px]">
              {dayJobs.length === 0 ? (
                <div className="text-center py-6 text-gray-200 text-xs">–</div>
              ) : (
                dayJobs
                  .sort((a, b) => {
                    const order = { red: 0, amber: 1, green: 2 };
                    return order[a.priority] - order[b.priority];
                  })
                  .map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      member={members.find((m) => m.id === job.assigneeId)}
                      onClick={onJobClick}
                    />
                  ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
