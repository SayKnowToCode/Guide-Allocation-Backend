const express = require('express');
const router = express.Router();
const rejectByGuideController = require('../controllers/rejectByGuideController');

router.post('/', rejectByGuideController.handleFunc);

module.exports = router;