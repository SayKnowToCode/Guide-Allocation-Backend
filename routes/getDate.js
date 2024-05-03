const express = require('express');
const router = express.Router();
const getDateController = require('../controllers/getDateController');

router.get('/', getDateController.getDateInfo);

module.exports = router;