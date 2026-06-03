import React from 'react';
import { useSocket } from '../hooks/useSocket';

export default function ConnectionStatus() {
  const { connected, latency } = useSocket();

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${
      connected
        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
        : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
    }`}>
      <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 live-dot' : 'bg-rose-400'}`} />
      {connected ? (
        <span>LIVE{latency ? ` · ${latency}ms` : ''}</span>
      ) : (
        <span>RECONNECTING...</span>
      )}
    </div>
  );
}
