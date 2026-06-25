import { Priority } from '../types';

interface UrgencyBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
}

const config: Record<Priority, { label: string; className: string }> = {
  red: { label: 'DRINGEND', className: 'bg-red-600 text-white' },
  amber: { label: 'DIESE WOCHE', className: 'bg-amber-500 text-white' },
  green: { label: 'GEPLANT', className: 'bg-emerald-500 text-white' },
};

export function UrgencyBadge({ priority, size = 'sm' }: UrgencyBadgeProps) {
  const { label, className } = config[priority];
  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1';
  return (
    <span className={`inline-flex items-center font-bold tracking-wider rounded ${sizeClass} ${className}`}>
      {label}
    </span>
  );
}
