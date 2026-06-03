const queueService = require('../services/queueService');

let connectedClients = 0;

function initSocket(io) {
  io.on('connection', async (socket) => {
    connectedClients++;
    console.log(`🔌 Client connected: ${socket.id} (total: ${connectedClients})`);

    // Send current queue state on connect/reconnect
    try {
      const payload = await queueService.buildQueuePayload();
      socket.emit('queue_updated', payload);
    } catch (err) {
      console.error('Error sending initial state:', err.message);
    }

    // Ping-pong for latency awareness
    socket.on('ping_check', () => {
      socket.emit('pong_check', { ts: Date.now() });
    });

    socket.on('disconnect', (reason) => {
      connectedClients--;
      console.log(`🔌 Client disconnected: ${socket.id} (reason: ${reason}, total: ${connectedClients})`);
    });

    socket.on('error', (err) => {
      console.error(`Socket error [${socket.id}]:`, err.message);
    });
  });

  io.engine.on('connection_error', (err) => {
    console.error('Socket engine error:', err.message);
  });
}

module.exports = { initSocket };
