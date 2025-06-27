const Payment = require('../models/Payment');
const Buyer = require('../models/Buyer');
// Get dues for the logged-in buyer
exports.getFarmerCropDues = async (req, res) => {
  const { buyer_id } = req.params;

  if (!buyer_id) {
    return res.status(400).json({ error: 'Buyer ID is required' });
  }

  try {
    const dues = await Payment.getFarmerCropDues(buyer_id);
    res.json(dues);
  } catch (err) {
    console.error("❌ Error fetching dues:", err);
    res.status(500).json({ error: 'Failed to fetch dues' });
  }
};

// Make a payment
exports.makePayment = async (req, res) => {
  const { buyer_id, farmer_id, crop_id, amount } = req.body;
  // console.log(req.body);
  if (!buyer_id || !farmer_id || !crop_id || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await Payment.makePayment({ buyer_id, farmer_id, crop_id, amount });
    res.json({success:true, message: 'Payment successful' });
  } catch (err) {
    console.error("❌ Error making payment:", err);
    res.status(500).json({ error: 'Failed to process payment' });
  }
};

exports.getBuyerTransactions = async (req, res) => {
  const { buyer_id } = req.params;
  if (!buyer_id) {
    return res.status(400).json({ error: "Missing buyer_id" });
  }

  try {
    const transactions = await Buyer.getTransactions(buyer_id);
    res.json(transactions);
  } catch (err) {
    console.error("❌ Error fetching transactions:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};
