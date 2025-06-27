const express = require("express");
const router = express.Router();
const procurementController = require("../controllers/procurementController");

// Existing route
router.post("/", procurementController.submitProcurement);

// New routes for finalizing procurements
router.get("/unpriced/:buyer_id", procurementController.getUnpricedProcurements);
// router.post("/add-cost", procurementController.finalizeProcurement);
router.post("/add-cost-new", procurementController.finalizeProcurementNew);

module.exports = router;
