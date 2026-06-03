import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { formatTime, padToken } from '../utils';

function ElapsedTimer({ startTime }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) return;
    const tick = () => setElapsed(Date.now() - new Date(startTime).getTime());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  const mins = Math.floor(elapsed / 60000);
  const secs = Math.floor((elapsed % 60000) / 1000);
  return (
    <span className="font-mono text-sm text-amber-400">
      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </span>
  );
}

export default function CurrentConsultation({ currentToken, onComplete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleComplete = async () => {
    setLoading(true);
    setError('');
    try {
      await api.completeConsultation();
      onComplete?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentToken) {
    return (
      <div className="card p-6 flex flex-col items-center justify-center min-h-[160px] text-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center">
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-slate-500 font-body text-sm">No active consultation</p>
      </div>
    );
  }

  return (
    <div className="card p-6 space-y-4 border-clinic-500/30 bg-clinic-500/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-clinic-400 live-dot" />
          <span className="text-clinic-400 text-xs font-mono font-semibold uppercase tracking-widest">In Consultation</span>
        </div>
        {currentToken.calledAt && <ElapsedTimer startTime={currentToken.calledAt} />}
      </div>

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-clinic-500/20 border border-clinic-500/30 flex items-center justify-center flex-shrink-0">
          <span className="font-mono font-bold text-clinic-300 text-xl">
            #{padToken(currentToken.tokenNumber)}
          </span>
        </div>
        <div>
          <h3 className="font-display font-bold text-white text-xl">{currentToken.patientName}</h3>
          <p className="text-slate-400 text-sm font-body">Called at {formatTime(currentToken.calledAt)}</p>
        </div>
      </div>

      {error && <p className="text-rose-400 text-sm">{error}</p>}

      <button
        onClick={handleComplete}
        disabled={loading}
        className="btn-success w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-40"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Completing...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Complete Consultation
          </>
        )}
      </button>
    </div>
  );
}
