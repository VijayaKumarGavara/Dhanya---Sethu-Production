const express = require('express');
const router = express.Router();
const workerController = require('../controllers/workerController');

// Routes
router.post('/register', workerController.registerWorker);
router.post('/login', workerController.loginWorker);
module.exports = router;
