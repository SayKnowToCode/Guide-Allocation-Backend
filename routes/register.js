const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');

router.post('/team', registerController.handleNewTeam);
router.put('/user', registerController.handleNewUser);

module.exports = router;