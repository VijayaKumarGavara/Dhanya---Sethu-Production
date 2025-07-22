const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');
const Farmer = require('../models/Farmer');
const multer = require('multer');
const upload = require('../middlewares/upload');
// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/farmers/'),
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    const filename = `farmer_${Date.now()}.${ext}`;
    cb(null, filename);
  }
});


// Routes
router.post('/register', upload.single('farmer_photo'), farmerController.registerFarmer);
router.post('/login', farmerController.loginFarmer);
// Selling records route (NEW)
router.get('/selling-records', farmerController.getSellingRecords);
router.get('/selling-records-new', farmerController.getSellingRecordsNew);
router.get('/procurement-requests', farmerController.getProcurementRequests);
// GET farmer by Aadhar number
// router.get('/by-aadhar/:aadhar', async (req, res) => {
//   const { aadhar } = req.params;
//   try {
//     const farmer = await Farmer.getFarmerByAadhar(aadhar);
//     if (!farmer) {
//       return res.status(404).json({ error: 'Farmer not found' });
//     }
//     res.json(farmer);
//   } catch (err) {
//     console.error('Error fetching farmer by Aadhar:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

module.exports = router;
