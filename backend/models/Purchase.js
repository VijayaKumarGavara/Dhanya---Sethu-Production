const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  farmerId: { type: String, required: true },
  buyerId: { type: String, required: true },
  noOfBags: { type: Number, required: true },          // Full 60kg bags
  looseWeight: { type: Number, default: 0 },           // Loose weight in KG
  quantity: { type: Number, required: true },          // Auto-calculated in quintals
  ratePerQuintal: { type: Number, required: true },    // Manual entry
  totalAmount: { type: Number, required: true },       // Auto-calculated
  paymentDone: { type: Number, default: 0 },
  balanceAmount: { type: Number, required: true },

  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Purchase', purchaseSchema);
