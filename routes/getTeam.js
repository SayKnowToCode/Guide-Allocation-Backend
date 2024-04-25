const express = require('express');
const router = express.Router();
const getTeamController = require('../controllers/getTeamController');

router.get('/', getTeamController.getTeamInfo);

module.exports = router;