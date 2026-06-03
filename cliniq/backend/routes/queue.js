const express = require('express');
const router = express.Router();
const { addPatient, getQueue, callNext, completeConsultation } = require('../controllers/queueController');

router.get('/', getQueue);
router.post('/add', addPatient);
router.post('/call-next', callNext);
router.post('/complete', completeConsultation);

module.exports = router;
