const express = require('express');
const router = express.Router();
const buyerController = require('../controllers/buyerController');

// Routes
router.post('/register', buyerController.registerBuyer);
router.post('/login', buyerController.loginBuyer);
router.get('/records', buyerController.getPurchaseRecords);
// router.get('/records', buyerController.getCropSettings);
module.exports = router;
