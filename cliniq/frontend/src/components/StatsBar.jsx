import React from 'react';
import { formatAvgTime } from '../utils';

export default function StatsBar({ totalWaiting, completedCount, avgConsultationMs }) {
  const stats = [
    {
      label: 'Waiting',
      value: totalWaiting,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
    },
    {
      label: 'Completed',
      value: completedCount,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
    },
    {
      label: 'Avg Duration',
      value: formatAvgTime(avgConsultationMs),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'text-clinic-400',
      bg: 'bg-clinic-400/10',
      subtitle: completedCount > 0 ? 'from real data' : 'default',
    },
    {
      label: 'Total Today',
      value: totalWaiting + completedCount,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'text-violet-400',
      bg: 'bg-violet-400/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="card p-4 flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center ${s.color} flex-shrink-0`}>
            {s.icon}
          </div>
          <div className="min-w-0">
            <p className={`font-display font-bold text-xl ${s.color}`}>{s.value}</p>
            <p className="text-slate-500 text-xs font-body truncate">{s.label}</p>
            {s.subtitle && (
              <p className="text-slate-600 text-xs font-mono">{s.subtitle}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
