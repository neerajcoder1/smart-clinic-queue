const Queue = require('../models/Queue');
const Settings = require('../models/Settings');

const TODAY = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Get next token number with atomic-style handling
async function getNextTokenNumber() {
  const today = TODAY();
  const last = await Queue.findOne({ sessionDate: today })
    .sort({ tokenNumber: -1 })
    .select('tokenNumber')
    .lean();
  return last ? last.tokenNumber + 1 : 1;
}

// Add a new patient to the queue
async function addPatient(patientName) {
  const today = TODAY();
  let retries = 0;
  const maxRetries = 5;

  while (retries < maxRetries) {
    try {
      const tokenNumber = await getNextTokenNumber();
      const patient = new Queue({
        tokenNumber,
        patientName: patientName.trim(),
        status: 'waiting',
        sessionDate: today,
      });
      await patient.save();
      return patient;
    } catch (err) {
      // Handle duplicate token (E11000) with retry
      if (err.code === 11000) {
        retries++;
        await new Promise((r) => setTimeout(r, 50 * retries));
        continue;
      }
      throw err;
    }
  }
  throw new Error('Failed to generate unique token after retries');
}

// Get full queue for today
async function getTodayQueue() {
  const today = TODAY();
  return Queue.find({ sessionDate: today })
    .sort({ tokenNumber: 1 })
    .lean();
}

// Get current in-progress patient
async function getInProgress() {
  return Queue.findOne({ status: 'in-progress' }).lean();
}

// Call the next waiting patient
async function callNext() {
  // Ensure no in-progress already (prevent double-click)
  const existing = await Queue.findOne({ status: 'in-progress' });
  if (existing) {
    throw new Error('A consultation is already in progress. Complete it first.');
  }

  const today = TODAY();
  const next = await Queue.findOne({ status: 'waiting', sessionDate: today })
    .sort({ tokenNumber: 1 });

  if (!next) {
    throw new Error('No patients waiting in queue.');
  }

  next.status = 'in-progress';
  next.calledAt = new Date();
  await next.save();
  return next;
}

// Complete current consultation
async function completeConsultation() {
  const patient = await Queue.findOne({ status: 'in-progress' });
  if (!patient) {
    throw new Error('No active consultation to complete.');
  }

  const now = new Date();
  const duration = now - new Date(patient.calledAt);

  patient.status = 'completed';
  patient.completedAt = now;
  patient.consultationDuration = duration;
  await patient.save();
  return patient;
}

// Calculate dynamic average consultation time (ms)
async function getAverageConsultationTime() {
  const today = TODAY();

  // Try to get a stored override first
  const override = await Settings.findOne({ key: 'avgConsultationOverride' }).lean();
  if (override) return override.value;

  const completed = await Queue.find({
    sessionDate: today,
    status: 'completed',
    consultationDuration: { $ne: null, $gt: 0 },
  })
    .select('consultationDuration')
    .lean();

  if (!completed.length) {
    // Fallback: check settings for default
    const def = await Settings.findOne({ key: 'defaultAvgMinutes' }).lean();
    const mins = def ? def.value : 7;
    return mins * 60 * 1000;
  }

  const total = completed.reduce((sum, p) => sum + p.consultationDuration, 0);
  return Math.round(total / completed.length);
}

// Build the full queue payload for broadcasting
async function buildQueuePayload() {
  const today = TODAY();
  const [allPatients, avgMs] = await Promise.all([
    Queue.find({ sessionDate: today }).sort({ tokenNumber: 1 }).lean(),
    getAverageConsultationTime(),
  ]);

  const waiting = allPatients.filter((p) => p.status === 'waiting');
  const inProgress = allPatients.find((p) => p.status === 'in-progress') || null;
  const completed = allPatients.filter((p) => p.status === 'completed');

  // Enrich waiting with position & estimated wait
  const enrichedWaiting = waiting.map((p, idx) => ({
    ...p,
    position: idx + 1,
    estimatedWaitMs: (idx + (inProgress ? 1 : 0)) * avgMs,
  }));

  return {
    currentToken: inProgress,
    waiting: enrichedWaiting,
    completed,
    totalWaiting: waiting.length,
    avgConsultationMs: avgMs,
    completedCount: completed.length,
    timestamp: Date.now(),
  };
}

// Update default avg minutes setting
async function setDefaultAvgMinutes(minutes) {
  await Settings.findOneAndUpdate(
    { key: 'defaultAvgMinutes' },
    { value: minutes },
    { upsert: true, new: true }
  );
}

module.exports = {
  addPatient,
  getTodayQueue,
  getInProgress,
  callNext,
  completeConsultation,
  getAverageConsultationTime,
  buildQueuePayload,
  setDefaultAvgMinutes,
};
