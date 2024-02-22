const express = require('express');
const router = express.Router();
const acceptByGuideController = require('../controllers/acceptByGuideController.js');

router.post('/', acceptByGuideController.handleFunc);

module.exports = router;