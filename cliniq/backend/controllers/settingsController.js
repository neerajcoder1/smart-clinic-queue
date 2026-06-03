const queueService = require('../services/queueService');
const Settings = require('../models/Settings');

// GET /api/settings
async function getSettings(req, res, next) {
  try {
    const settings = await Settings.find().lean();
    const map = {};
    settings.forEach((s) => (map[s.key] = s.value));
    return res.json(map);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/settings/avg-minutes
async function updateAvgMinutes(req, res, next) {
  try {
    const { minutes } = req.body;
    const mins = parseFloat(minutes);
    if (!mins || mins <= 0 || mins > 120) {
      return res.status(400).json({ error: 'Minutes must be between 1 and 120.' });
    }
    await queueService.setDefaultAvgMinutes(mins);
    const payload = await queueService.buildQueuePayload();
    req.io.emit('queue_updated', payload);
    return res.json({ success: true, defaultAvgMinutes: mins });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSettings, updateAvgMinutes };
