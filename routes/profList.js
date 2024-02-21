const express = require('express');
const router = express.Router();
const profListController = require('../controllers/profListController');

router.get('/', profListController.sendData);

module.exports = router;