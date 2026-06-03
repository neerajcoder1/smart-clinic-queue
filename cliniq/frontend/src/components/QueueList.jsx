import React, { useState } from 'react';
import { api } from '../services/api';
import { formatWaitTime, formatTime, padToken, statusColor } from '../utils';

function QueueRow({ patient, isFirst, hasInProgress }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      isFirst && !hasInProgress
        ? 'bg-amber-500/10 border border-amber-500/20'
        : 'hover:bg-slate-800/50'
    }`}>
      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
        <span className="font-mono text-sm font-semibold text-slate-300">
          #{padToken(patient.tokenNumber)}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-medium text-white text-sm truncate">{patient.patientName}</p>
        <p className="text-slate-500 text-xs font-body">
          Joined {formatTime(patient.joinedAt)}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-amber-400 font-mono text-sm font-semibold">
          {patient.position === 1 && !hasInProgress ? 'Next up' : formatWaitTime(patient.estimatedWaitMs)}
        </p>
        <p className="text-slate-600 text-xs">#{patient.position}</p>
      </div>
    </div>
  );
}

export default function QueueList({ waiting, currentToken, avgConsultationMs, onCallNext }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCallNext = async () => {
    setLoading(true);
    setError('');
    try {
      await api.callNext();
      onCallNext?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h2 className="font-display font-semibold text-white text-lg">Waiting Queue</h2>
            <p className="text-slate-500 text-xs font-body">
              {waiting.length} patient{waiting.length !== 1 ? 's' : ''} · avg {Math.round(avgConsultationMs / 60000)} min/consult
            </p>
          </div>
        </div>

        <button
          onClick={handleCallNext}
          disabled={loading || !!currentToken || waiting.length === 0}
          className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          )}
          Call Next
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm px-3 py-2 rounded-lg font-body">
          {error}
        </div>
      )}

      {currentToken && (
        <div className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-lg font-mono">
          ⚠ Complete current consultation before calling next
        </div>
      )}

      <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
        {waiting.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm font-body">Queue is empty</p>
          </div>
        ) : (
          waiting.map((p, idx) => (
            <QueueRow
              key={p._id}
              patient={p}
              isFirst={idx === 0}
              hasInProgress={!!currentToken}
            />
          ))
        )}
      </div>
    </div>
  );
}
