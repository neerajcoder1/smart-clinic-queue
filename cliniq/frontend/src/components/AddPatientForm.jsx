import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';

export default function AddPatientForm({ onAdded }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastAdded, setLastAdded] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter a patient name.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await api.addPatient(trimmed);
      setLastAdded(result.patient);
      setName('');
      onAdded?.(result);
      inputRef.current?.focus();
      // Clear lastAdded after 3s
      setTimeout(() => setLastAdded(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-clinic-500/20 flex items-center justify-center text-clinic-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h2 className="font-display font-semibold text-white text-lg">Add Patient</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            placeholder="Patient name..."
            maxLength={100}
            disabled={loading}
            className="w-full bg-slate-800 border border-slate-700 focus:border-clinic-500 focus:ring-1 focus:ring-clinic-500/50
              rounded-xl px-4 py-3.5 text-white text-lg font-display placeholder-slate-500
              outline-none transition-all disabled:opacity-50"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
          />
          {error && (
            <p className="text-rose-400 text-sm mt-1.5 font-body">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="btn-primary w-full text-lg py-4 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Adding...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add to Queue
            </>
          )}
        </button>
      </form>

      {lastAdded && (
        <div className="flex items-center gap-3 bg-clinic-500/10 border border-clinic-500/30 rounded-xl px-4 py-3 animate-slide-up">
          <div className="w-10 h-10 rounded-xl bg-clinic-500/20 flex items-center justify-center">
            <span className="font-mono font-bold text-clinic-400 text-sm">
              #{String(lastAdded.tokenNumber).padStart(3, '0')}
            </span>
          </div>
          <div>
            <p className="text-clinic-300 font-display font-semibold text-sm">{lastAdded.patientName}</p>
            <p className="text-clinic-500 text-xs font-body">Token issued successfully</p>
          </div>
          <div className="ml-auto">
            <svg className="w-5 h-5 text-clinic-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
