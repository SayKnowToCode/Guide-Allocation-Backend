const express = require('express');
const router = express.Router();
const setDateController = require('../controllers/setDateController');

router.post('/', setDateController.setDateInfo);

module.exports = router;