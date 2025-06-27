const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Get farmer crop dues for a buyer
router.get("/dues/:buyer_id", paymentController.getFarmerCropDues);

// Make a payment
router.post("/make-payment", paymentController.makePayment);

// ✅ New: Get transactions for a buyer
router.get("/transactions/:buyer_id", paymentController.getBuyerTransactions);
module.exports = router;
