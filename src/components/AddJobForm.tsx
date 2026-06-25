import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { JobFormData, TeamMember, Priority, JobStatus } from '../types';

interface AddJobFormProps {
  members: TeamMember[];
  onClose: () => void;
  onAdd: (data: JobFormData) => void;
}

export function AddJobForm({ members, onClose, onAdd }: AddJobFormProps) {
  const [form, setForm] = useState<JobFormData>({
    auftraggeber: '',
    bereich: '',
    aufgabe: '',
    briefing: '',
    abgabe: new Date().toISOString().split('T')[0],
    assigneeId: members[0]?.id ?? '',
    priority: 'amber',
    status: 'offen',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormData, string>>>({});

  const validate = () => {
    const e: Partial<Record<keyof JobFormData, string>> = {};
    if (!form.auftraggeber.trim()) e.auftraggeber = 'Pflichtfeld';
    if (!form.aufgabe.trim()) e.aufgabe = 'Pflichtfeld';
    if (!form.abgabe) e.abgabe = 'Pflichtfeld';
    if (!form.assigneeId) e.assigneeId = 'Pflichtfeld';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onAdd(form);
    onClose();
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (tag && !form.tags.includes(tag)) {
      setForm({ ...form, tags: [...form.tags, tag] });
    }
    setTagInput('');
  };

  const priorities: { value: Priority; label: string; color: string }[] = [
    { value: 'red', label: 'Dringend', color: 'bg-red-600' },
    { value: 'amber', label: 'Diese Woche', color: 'bg-amber-500' },
    { value: 'green', label: 'Geplant', color: 'bg-emerald-500' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Neuer Auftrag</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Auftraggeber *</label>
              <input
                className={`border rounded-lg px-3 py-2 text-sm w-full ${errors.auftraggeber ? 'border-red-400' : 'border-gray-200'}`}
                placeholder="z.B. Marketing Abteilung"
                value={form.auftraggeber}
                onChange={(e) => setForm({ ...form, auftraggeber: e.target.value })}
              />
              {errors.auftraggeber && <p className="text-red-500 text-xs mt-0.5">{errors.auftraggeber}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Bereich</label>
              <input
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
                placeholder="z.B. Social Media, Print"
                value={form.bereich}
                onChange={(e) => setForm({ ...form, bereich: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Aufgabe / Titel *</label>
            <input
              className={`border rounded-lg px-3 py-2 text-sm w-full ${errors.aufgabe ? 'border-red-400' : 'border-gray-200'}`}
              placeholder="Kurze Beschreibung der Aufgabe"
              value={form.aufgabe}
              onChange={(e) => setForm({ ...form, aufgabe: e.target.value })}
            />
            {errors.aufgabe && <p className="text-red-500 text-xs mt-0.5">{errors.aufgabe}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Briefing</label>
            <textarea
              rows={3}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full resize-none"
              placeholder="Details, Anforderungen, Hinweise..."
              value={form.briefing}
              onChange={(e) => setForm({ ...form, briefing: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Abgabe *</label>
              <input
                type="date"
                className={`border rounded-lg px-3 py-2 text-sm w-full ${errors.abgabe ? 'border-red-400' : 'border-gray-200'}`}
                value={form.abgabe}
                onChange={(e) => setForm({ ...form, abgabe: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Zuständig *</label>
              <select
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
                value={form.assigneeId}
                onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Priorität</label>
            <div className="flex gap-2">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setForm({ ...form, priority: p.value })}
                  className={`flex-1 py-2 rounded-lg text-white text-xs font-semibold transition-opacity ${p.color} ${form.priority === p.value ? 'opacity-100 ring-2 ring-offset-1 ring-gray-400' : 'opacity-40'}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Status</label>
            <select
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as JobStatus })}
            >
              <option value="offen">Offen</option>
              <option value="in-arbeit">In Arbeit</option>
              <option value="review">Review</option>
              <option value="fertig">Fertig</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Tags</label>
            <div className="flex gap-2">
              <input
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1"
                placeholder="Tag hinzufügen..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              />
              <button type="button" onClick={addTag} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <Plus size={16} />
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    onClick={() => setForm({ ...form, tags: form.tags.filter((t) => t !== tag) })}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full cursor-pointer hover:bg-red-100 hover:text-red-600"
                  >
                    #{tag} ×
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2">
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-6 py-2 rounded-lg transition-colors"
            >
              <Plus size={16} />
              Auftrag erstellen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
