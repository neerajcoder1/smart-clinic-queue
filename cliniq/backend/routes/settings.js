const express = require('express');
const router = express.Router();
const { getSettings, updateAvgMinutes } = require('../controllers/settingsController');

router.get('/', getSettings);
router.patch('/avg-minutes', updateAvgMinutes);

module.exports = router;
