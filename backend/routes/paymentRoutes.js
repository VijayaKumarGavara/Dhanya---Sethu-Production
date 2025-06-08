const express = require('express');
const router = express.Router();

const {
  makePayment,
  getPendingPayments,
  getPaymentsByBuyer,
  getPaymentsByFarmer,
  markPaymentAsPaid
} = require('../controllers/paymentController');

// Record a new payment
router.post('/pay', makePayment);

// Get all pending payments
router.get('/pending', getPendingPayments);

// Get payments by buyer ID
router.get('/buyer/:buyerId', getPaymentsByBuyer);

// Get payments by farmer ID
router.get('/farmer/:farmerId', getPaymentsByFarmer);

// Mark a payment as paid
router.put('/mark-paid/:id', markPaymentAsPaid);

module.exports = router;
