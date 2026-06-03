import React from 'react';
import AddPatientForm from '../components/AddPatientForm';
import CurrentConsultation from '../components/CurrentConsultation';
import QueueList from '../components/QueueList';
import StatsBar from '../components/StatsBar';
import CompletedLog from '../components/CompletedLog';
import ConnectionStatus from '../components/ConnectionStatus';
import { useQueue } from '../hooks/useQueue';

export default function ReceptionistDashboard() {
  const { queue, loading } = useQueue();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-clinic-500/30 border-t-clinic-500 rounded-full animate-spin" />
          <p className="text-slate-400 font-body text-sm">Loading queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-clinic-400 to-clinic-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h1 className="font-display font-bold text-white text-lg leading-none">ClinIQ</h1>
              <p className="text-slate-500 text-xs font-body">Receptionist Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ConnectionStatus />
            <a
              href="/display"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm px-4 py-2 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Patient Display
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats */}
        <StatsBar
          totalWaiting={queue.totalWaiting}
          completedCount={queue.completedCount}
          avgConsultationMs={queue.avgConsultationMs}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-1 space-y-6">
            <AddPatientForm />
            <CurrentConsultation currentToken={queue.currentToken} />
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-6">
            <QueueList
              waiting={queue.waiting}
              currentToken={queue.currentToken}
              avgConsultationMs={queue.avgConsultationMs}
            />
            <CompletedLog completed={queue.completed} />
          </div>
        </div>

        {/* Dynamic Wait Time explanation */}
        {queue.completedCount > 0 && (
          <div className="card-glass p-4 flex items-start gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-lg bg-clinic-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-clinic-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-clinic-300 text-sm font-display font-medium">
                Smart Wait Time Active
              </p>
              <p className="text-slate-400 text-xs font-body mt-0.5">
                Wait times are now calculated from {queue.completedCount} real consultation{queue.completedCount !== 1 ? 's' : ''} today. 
                Average: {Math.round(queue.avgConsultationMs / 60000)} min per patient.
                <span className="text-clinic-400"> This becomes more accurate throughout the day.</span>
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
