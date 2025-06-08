const Payment = require('../models/Payment');
const Purchase = require('../models/Purchase');

// Make a payment (update purchase and create a payment record)
exports.makePayment = async (req, res) => {
  try {
    const { buyerId, farmerId, amount } = req.body;

    // Update the corresponding purchase record
    const purchase = await Purchase.findOne({ farmerId, buyerId });

    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found for this buyer and farmer' });
    }

    purchase.paymentDone += amount;
    purchase.balanceAmount = purchase.totalAmount - purchase.paymentDone;
    purchase.updatedAt = new Date();
    await purchase.save();

    // Create a new payment record
    const payment = new Payment({
      buyerId,
      farmerId,
      amount,
      status: 'Pending', // initially pending
    });

    await payment.save();

    res.status(200).json({
      message: 'Payment recorded successfully',
      purchase,
      payment,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all pending payments
exports.getPendingPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'Pending' })
      .populate('buyerId', 'name')
      .populate('farmerId', 'name mobile village');

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get payments by Buyer ID
exports.getPaymentsByBuyer = async (req, res) => {
  try {
    const { buyerId } = req.params;
    const payments = await Payment.find({ buyerId })
      .populate('farmerId', 'name mobile village');

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get payments by Farmer ID
exports.getPaymentsByFarmer = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const payments = await Payment.find({ farmerId })
      .populate('buyerId', 'name');

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark a payment as Paid
exports.markPaymentAsPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByIdAndUpdate(
      id,
      {
        status: 'Paid',
        paymentDate: new Date()
      },
      { new: true }
    );

    res.json({ message: 'Payment marked as paid', payment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
