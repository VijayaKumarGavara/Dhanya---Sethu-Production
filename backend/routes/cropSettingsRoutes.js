const express = require('express');
const router = express.Router();
const cropSettingsController = require('../controllers/cropSettingsController');

router.get('/buyer-crop-settings/:buyer_id', cropSettingsController.getBuyerCropSettings);

module.exports = router;
