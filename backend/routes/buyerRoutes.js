const express = require('express');
const router = express.Router();
const buyerController = require('../controllers/buyerController');
const Farmer = require('../models/Farmer');
// Routes
router.post('/register', buyerController.registerBuyer);
router.post('/login', buyerController.loginBuyer);
router.get('/records', buyerController.getPurchaseRecords);
// router.get('/records', buyerController.getCropSettings);

// buyerRoutes.js or workerRoutes.js

router.get('/farmer/by-aadhar/:aadhar', async (req, res) => {
  const { aadhar } = req.params;
  try {
    const farmer = await Farmer.getFarmerByAadhar(aadhar);
    if (!farmer || farmer.length === 0) {
      return res.status(404).json({ error: 'Farmer not found' });
    }
    res.json(farmer);
  } catch (err) {
    console.error('Error fetching farmer by Aadhar:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
