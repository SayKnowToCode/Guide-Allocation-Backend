const express = require('express');
const router = express.Router();
const expertGuideController = require('../controllers/expertGuideController');

router.post('/', expertGuideController.handleFunc);

module.exports = router;