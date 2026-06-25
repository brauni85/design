import { useState, useCallback, useMemo } from 'react';
import { startOfWeek, endOfWeek, isWithinInterval, addWeeks, subWeeks } from 'date-fns';
import { Job, JobFormData, Priority } from '../types';
import { MOCK_JOBS } from '../data/mockData';

function computePriority(deadline: Date): Priority {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  const hours = diff / (1000 * 60 * 60);
  if (hours <= 24) return 'red';
  if (hours <= 168) return 'amber';
  return 'green';
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('alle');
  const [priorityFilter, setPriorityFilter] = useState<string>('alle');

  const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (selectedAssignees.length > 0 && !selectedAssignees.includes(job.assigneeId)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!job.aufgabe.toLowerCase().includes(q) && !job.auftraggeber.toLowerCase().includes(q)) return false;
      }
      if (statusFilter !== 'alle' && job.status !== statusFilter) return false;
      if (priorityFilter !== 'alle' && job.priority !== priorityFilter) return false;
      return true;
    });
  }, [jobs, selectedAssignees, searchQuery, statusFilter, priorityFilter]);

  const weekJobs = useMemo(() => {
    return filteredJobs.filter((job) =>
      isWithinInterval(job.abgabe, { start: currentWeekStart, end: weekEnd })
    );
  }, [filteredJobs, currentWeekStart, weekEnd]);

  const addJob = useCallback((data: JobFormData) => {
    const deadline = new Date(data.abgabe);
    const newJob: Job = {
      id: Date.now().toString(),
      auftraggeber: data.auftraggeber,
      bereich: data.bereich,
      aufgabe: data.aufgabe,
      briefing: data.briefing,
      abgabe: deadline,
      assigneeId: data.assigneeId,
      priority: data.priority || computePriority(deadline),
      status: data.status,
      tags: data.tags,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setJobs((prev) => [...prev, newJob]);
  }, []);

  const updateJob = useCallback((id: string, updates: Partial<Job>) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id ? { ...job, ...updates, updatedAt: new Date() } : job
      )
    );
  }, []);

  const deleteJob = useCallback((id: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  }, []);

  const nextWeek = useCallback(() => setCurrentWeekStart((d) => addWeeks(d, 1)), []);
  const prevWeek = useCallback(() => setCurrentWeekStart((d) => subWeeks(d, 1)), []);

  const toggleAssignee = useCallback((id: string) => {
    setSelectedAssignees((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  }, []);

  return {
    jobs,
    filteredJobs,
    weekJobs,
    currentWeekStart,
    selectedAssignees,
    searchQuery,
    statusFilter,
    priorityFilter,
    addJob,
    updateJob,
    deleteJob,
    nextWeek,
    prevWeek,
    toggleAssignee,
    setSearchQuery,
    setStatusFilter,
    setPriorityFilter,
  };
}
