import { useState, useEffect, useCallback } from 'react';
import socket from '../socket/socket';
import { api } from '../services/api';

export function useQueue() {
  const [queue, setQueue] = useState({
    currentToken: null,
    waiting: [],
    completed: [],
    totalWaiting: 0,
    avgConsultationMs: 7 * 60 * 1000,
    completedCount: 0,
    timestamp: null,
  });
  const [connected, setConnected] = useState(socket.connected);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const updateQueue = useCallback((payload) => {
    setQueue(payload);
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    // Initial fetch in case socket is slow
    api.getQueue().then(updateQueue).catch(() => setLoading(false));

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onQueueUpdated = (payload) => updateQueue(payload);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('queue_updated', onQueueUpdated);

    // Also react to specific events for granularity
    socket.on('patient_added', ({ queue: q }) => updateQueue(q));
    socket.on('token_called', ({ queue: q }) => updateQueue(q));
    socket.on('consultation_completed', ({ queue: q }) => updateQueue(q));

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('queue_updated', onQueueUpdated);
      socket.off('patient_added');
      socket.off('token_called');
      socket.off('consultation_completed');
    };
  }, [updateQueue]);

  return { queue, connected, loading, error };
}
