const express = require('express');
const router = express.Router();
const sendGuideRequestController = require('../controllers/sendGuideRequestController');

router.put('/', sendGuideRequestController.sendData);

module.exports = router;