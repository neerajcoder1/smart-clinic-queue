const queueService = require('../services/queueService');

// POST /api/queue/add
async function addPatient(req, res, next) {
  try {
    const { patientName } = req.body;
    if (!patientName || !patientName.trim()) {
      return res.status(400).json({ error: 'Patient name is required.' });
    }

    const patient = await queueService.addPatient(patientName);
    const payload = await queueService.buildQueuePayload();

    req.io.emit('queue_updated', payload);
    req.io.emit('patient_added', { patient, queue: payload });

    return res.status(201).json({ success: true, patient, queue: payload });
  } catch (err) {
    next(err);
  }
}

// GET /api/queue
async function getQueue(req, res, next) {
  try {
    const payload = await queueService.buildQueuePayload();
    return res.json(payload);
  } catch (err) {
    next(err);
  }
}

// POST /api/queue/call-next
async function callNext(req, res, next) {
  try {
    const patient = await queueService.callNext();
    const payload = await queueService.buildQueuePayload();

    req.io.emit('queue_updated', payload);
    req.io.emit('token_called', { patient, queue: payload });
    req.io.emit('consultation_started', { patient });

    return res.json({ success: true, patient, queue: payload });
  } catch (err) {
    if (err.message.includes('already in progress') || err.message.includes('No patients')) {
      return res.status(409).json({ error: err.message });
    }
    next(err);
  }
}

// POST /api/queue/complete
async function completeConsultation(req, res, next) {
  try {
    const patient = await queueService.completeConsultation();
    const payload = await queueService.buildQueuePayload();

    req.io.emit('queue_updated', payload);
    req.io.emit('consultation_completed', { patient, queue: payload });

    return res.json({ success: true, patient, queue: payload });
  } catch (err) {
    if (err.message.includes('No active')) {
      return res.status(409).json({ error: err.message });
    }
    next(err);
  }
}

module.exports = { addPatient, getQueue, callNext, completeConsultation };
