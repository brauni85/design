export type Priority = 'red' | 'amber' | 'green';
export type ViewMode = 'week' | 'person';
export type JobStatus = 'offen' | 'in-arbeit' | 'review' | 'fertig';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  workDays?: number[];
}

export interface Job {
  id: string;
  auftraggeber: string;
  bereich: string;
  aufgabe: string;
  briefing: string;
  abgabe: Date;
  assigneeId: string;
  priority: Priority;
  status: JobStatus;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  outlookEventId?: string;
}

export interface JobFormData {
  auftraggeber: string;
  bereich: string;
  aufgabe: string;
  briefing: string;
  abgabe: string;
  assigneeId: string;
  priority: Priority;
  status: JobStatus;
  tags: string[];
}
