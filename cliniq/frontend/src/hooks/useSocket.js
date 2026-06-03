import { useState, useEffect } from 'react';
import socket from '../socket/socket';

export function useSocket() {
  const [connected, setConnected] = useState(socket.connected);
  const [latency, setLatency] = useState(null);

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onPong = ({ ts }) => setLatency(Date.now() - ts);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('pong_check', onPong);

    // Measure latency every 5s
    const interval = setInterval(() => {
      if (socket.connected) socket.emit('ping_check');
    }, 5000);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('pong_check', onPong);
      clearInterval(interval);
    };
  }, []);

  return { connected, latency };
}
