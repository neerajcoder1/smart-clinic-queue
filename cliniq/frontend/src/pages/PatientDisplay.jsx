import React, { useEffect, useState } from 'react';
import { useQueue } from '../hooks/useQueue';
import ConnectionStatus from '../components/ConnectionStatus';
import { formatWaitTime, padToken } from '../utils';

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono text-slate-400 text-sm">
      {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
    </span>
  );
}

function BigTokenDisplay({ token }) {
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [token?.tokenNumber]);

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-20 h-20 rounded-3xl bg-slate-800/80 flex items-center justify-center">
          <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-slate-500 font-display text-xl">Waiting to start</p>
        <p className="text-slate-600 font-body text-base">No patient is being seen yet</p>
      </div>
    );
  }

  return (
    <div key={animKey} className="flex flex-col items-center gap-6 token-pop">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-clinic-400 live-dot" />
          <span className="text-clinic-400 font-mono text-sm font-semibold uppercase tracking-widest">Now Serving</span>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-clinic-400/20 rounded-3xl blur-3xl scale-110" />
          <div className="relative bg-gradient-to-br from-clinic-500/30 to-clinic-700/20 border-2 border-clinic-500/50 rounded-3xl px-16 py-8 text-center">
            <div className="font-mono font-bold text-clinic-300 text-2xl mb-1">TOKEN</div>
            <div className="font-display font-black text-white" style={{ fontSize: 'clamp(5rem, 15vw, 9rem)', lineHeight: 1 }}>
              {padToken(token.tokenNumber)}
            </div>
          </div>
        </div>

        <p className="font-display text-2xl text-white font-semibold mt-2">{token.patientName}</p>
        <p className="text-slate-400 font-body text-base">Please proceed to the consultation room</p>
      </div>
    </div>
  );
}

function WaitingPatientRow({ patient, avgMs }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
      <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center flex-shrink-0">
        <span className="font-mono font-bold text-slate-300 text-base">#{padToken(patient.tokenNumber)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-white text-lg truncate">{patient.patientName}</p>
        <p className="text-slate-400 text-sm font-body">Position #{patient.position} in queue</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-amber-400 font-mono text-xl font-bold">{formatWaitTime(patient.estimatedWaitMs)}</p>
        <p className="text-slate-500 text-xs font-body">est. wait</p>
      </div>
    </div>
  );
}

export default function PatientDisplay() {
  const { queue, loading } = useQueue();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-clinic-500/30 border-t-clinic-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl px-6 h-16 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-clinic-400 to-clinic-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="font-display font-bold text-white text-xl">ClinIQ</h1>
          <span className="text-slate-600 font-body text-sm hidden sm:block">— Patient Waiting Room</span>
        </div>
        <div className="flex items-center gap-4">
          <LiveClock />
          <ConnectionStatus />
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-8 py-8 sm:py-12 space-y-10">
        {/* Current Token Big Display */}
        <section>
          <BigTokenDisplay token={queue.currentToken} />
        </section>

        <div className="border-t border-slate-800" />

        {/* Waiting List */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="font-display font-bold text-white text-2xl">
                Queue
                {queue.totalWaiting > 0 && (
                  <span className="text-amber-400 ml-2">({queue.totalWaiting})</span>
                )}
              </h2>
            </div>

            {queue.completedCount > 0 && (
              <div className="text-right">
                <p className="text-slate-400 text-sm font-body">Avg wait time</p>
                <p className="text-clinic-400 font-mono font-bold text-lg">
                  {Math.round(queue.avgConsultationMs / 60000)} min
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {queue.waiting.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <div className="w-16 h-16 rounded-3xl bg-slate-800 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-slate-400 font-display text-xl">No patients waiting</p>
                  <p className="text-slate-600 font-body text-base mt-1">Queue is clear</p>
                </div>
              </div>
            ) : (
              queue.waiting.map((p) => (
                <WaitingPatientRow key={p._id} patient={p} avgMs={queue.avgConsultationMs} />
              ))
            )}
          </div>
        </section>

        {/* Footer note */}
        <div className="text-center pb-4">
          <p className="text-slate-600 text-sm font-body">
            Updates automatically · {queue.completedCount > 0
              ? `Wait times based on ${queue.completedCount} real consultation${queue.completedCount !== 1 ? 's' : ''} today`
              : 'Estimated wait times shown'}
          </p>
        </div>
      </main>
    </div>
  );
}
