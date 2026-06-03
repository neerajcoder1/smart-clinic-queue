import React, { useState } from 'react';
import { formatTime, formatWaitTime, padToken } from '../utils';

export default function CompletedLog({ completed }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? completed : completed.slice(0, 5);

  return (
    <div className="card p-6 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h2 className="font-display font-semibold text-white text-lg">Completed Today</h2>
        </div>
        <span className="text-emerald-400 font-mono text-sm font-semibold">{completed.length}</span>
      </div>

      <div className="space-y-1.5 max-h-64 overflow-y-auto">
        {completed.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-6 font-body">No completed consultations yet</p>
        ) : (
          shown.slice().reverse().map((p) => (
            <div key={p._id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/50">
              <span className="font-mono text-xs text-slate-500 w-10 flex-shrink-0">
                #{padToken(p.tokenNumber)}
              </span>
              <span className="text-slate-300 text-sm font-body flex-1 truncate">{p.patientName}</span>
              <span className="text-emerald-500 text-xs font-mono flex-shrink-0">
                {p.consultationDuration ? formatWaitTime(p.consultationDuration) : '—'}
              </span>
              <span className="text-slate-600 text-xs font-mono flex-shrink-0">
                {formatTime(p.completedAt)}
              </span>
            </div>
          ))
        )}
      </div>

      {completed.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-clinic-400 text-xs font-body hover:text-clinic-300 transition-colors w-full text-center pt-1"
        >
          {expanded ? 'Show less' : `Show all ${completed.length}`}
        </button>
      )}
    </div>
  );
}
