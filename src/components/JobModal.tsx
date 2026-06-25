import { useState, useEffect } from 'react';
import { X, Calendar, User, Tag, Trash2, Save } from 'lucide-react';
import { Job, JobFormData, TeamMember, Priority, JobStatus } from '../types';
import { UrgencyBadge } from './UrgencyBadge';
import { formatDeadline } from '../services/jobService';
import { format } from 'date-fns';

interface JobModalProps {
  job: Job;
  members: TeamMember[];
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Job>) => void;
  onDelete: (id: string) => void;
}

export function JobModal({ job, members, onClose, onUpdate, onDelete }: JobModalProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<JobFormData>({
    auftraggeber: job.auftraggeber,
    bereich: job.bereich,
    aufgabe: job.aufgabe,
    briefing: job.briefing,
    abgabe: format(job.abgabe, 'yyyy-MM-dd'),
    assigneeId: job.assigneeId,
    priority: job.priority,
    status: job.status,
    tags: job.tags,
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const member = members.find((m) => m.id === job.assigneeId);

  const handleSave = () => {
    onUpdate(job.id, {
      auftraggeber: form.auftraggeber,
      bereich: form.bereich,
      aufgabe: form.aufgabe,
      briefing: form.briefing,
      abgabe: new Date(form.abgabe),
      assigneeId: form.assigneeId,
      priority: form.priority,
      status: form.status,
      tags: form.tags,
    });
    setEditing(false);
    onClose();
  };

  const priorities: { value: Priority; label: string; color: string }[] = [
    { value: 'red', label: 'Dringend', color: 'bg-red-600' },
    { value: 'amber', label: 'Diese Woche', color: 'bg-amber-500' },
    { value: 'green', label: 'Geplant', color: 'bg-emerald-500' },
  ];

  const statuses: { value: JobStatus; label: string }[] = [
    { value: 'offen', label: 'Offen' },
    { value: 'in-arbeit', label: 'In Arbeit' },
    { value: 'review', label: 'Review' },
    { value: 'fertig', label: 'Fertig' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {job.auftraggeber} · {job.bereich}
              </span>
              <UrgencyBadge priority={job.priority} />
            </div>
            {editing ? (
              <input
                className="text-xl font-bold text-gray-900 w-full border-b-2 border-red-500 outline-none pb-1"
                value={form.aufgabe}
                onChange={(e) => setForm({ ...form, aufgabe: e.target.value })}
              />
            ) : (
              <h2 className="text-xl font-bold text-gray-900">{job.aufgabe}</h2>
            )}
          </div>
          <button onClick={onClose} className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Meta row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                <Calendar size={11} className="inline mr-1" />Abgabe
              </label>
              {editing ? (
                <input
                  type="date"
                  className="border border-gray-200 rounded px-2 py-1 text-sm w-full"
                  value={form.abgabe}
                  onChange={(e) => setForm({ ...form, abgabe: e.target.value })}
                />
              ) : (
                <span className="text-sm font-semibold text-gray-800">{formatDeadline(job.abgabe)}</span>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                <User size={11} className="inline mr-1" />Zuständig
              </label>
              {editing ? (
                <select
                  className="border border-gray-200 rounded px-2 py-1 text-sm w-full"
                  value={form.assigneeId}
                  onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center gap-2">
                  {member && (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.initials}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-gray-800">{member?.name ?? '–'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Auftraggeber */}
          {editing && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Auftraggeber</label>
                <input
                  className="border border-gray-200 rounded px-2 py-1 text-sm w-full"
                  value={form.auftraggeber}
                  onChange={(e) => setForm({ ...form, auftraggeber: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Bereich</label>
                <input
                  className="border border-gray-200 rounded px-2 py-1 text-sm w-full"
                  value={form.bereich}
                  onChange={(e) => setForm({ ...form, bereich: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Priority + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Priorität</label>
              {editing ? (
                <div className="flex gap-2">
                  {priorities.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setForm({ ...form, priority: p.value })}
                      className={`flex-1 py-1.5 rounded text-white text-xs font-semibold transition-opacity ${p.color} ${form.priority === p.value ? 'opacity-100 ring-2 ring-offset-1 ring-gray-400' : 'opacity-50'}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              ) : (
                <UrgencyBadge priority={job.priority} size="md" />
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Status</label>
              {editing ? (
                <select
                  className="border border-gray-200 rounded px-2 py-1 text-sm w-full"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as JobStatus })}
                >
                  {statuses.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              ) : (
                <span className="text-sm font-semibold">{statuses.find(s => s.value === job.status)?.label}</span>
              )}
            </div>
          </div>

          {/* Briefing */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Briefing</label>
            {editing ? (
              <textarea
                rows={4}
                className="border border-gray-200 rounded px-3 py-2 text-sm w-full resize-none"
                value={form.briefing}
                onChange={(e) => setForm({ ...form, briefing: e.target.value })}
              />
            ) : (
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-3">{job.briefing}</p>
            )}
          </div>

          {/* Tags */}
          {job.tags.length > 0 && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                <Tag size={11} className="inline mr-1" />Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {job.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">#{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={() => { if (confirm('Auftrag wirklich löschen?')) { onDelete(job.id); onClose(); } }}
            className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-800 transition-colors"
          >
            <Trash2 size={14} />
            Löschen
          </button>
          <div className="flex items-center gap-3">
            {editing ? (
              <>
                <button onClick={() => setEditing(false)} className="text-sm text-gray-500 hover:text-gray-700">Abbrechen</button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  <Save size={14} />
                  Speichern
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Bearbeiten
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
