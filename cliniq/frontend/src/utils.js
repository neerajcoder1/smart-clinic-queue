export function formatWaitTime(ms) {
  if (!ms || ms <= 0) return '< 1 min';
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  if (minutes < 60) return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export function formatAvgTime(ms) {
  if (!ms) return '—';
  const mins = Math.round(ms / 60000);
  return `${mins} min`;
}

export function formatTime(date) {
  if (!date) return '—';
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function padToken(num) {
  return String(num).padStart(3, '0');
}

export function statusColor(status) {
  switch (status) {
    case 'waiting': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    case 'in-progress': return 'text-clinic-400 bg-clinic-400/10 border-clinic-400/20';
    case 'completed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
  }
}
