// const db = require('../config/db');

// exports.submitProcurement = async (req, res) => {
//   const { buyer_id, farmer_id, crop_id, quantity, unit } = req.body;

//   if (!buyer_id || !farmer_id || !crop_id || !quantity || !unit) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   try {
//     const [result] = await db.query(
//       `INSERT INTO procurement_requests (buyer_id, farmer_id, crop_id, quantity, unit_type)
//        VALUES (?, ?, ?, ?, ?)`,
//       [buyer_id, farmer_id, crop_id, quantity, unit]
//     );

//     res.status(201).json({ message: "Procurement submitted", request_id: result.insertId });
//   } catch (err) {
//     console.error("Procurement submit error:", err);
//     res.status(500).json({ error: "Failed to submit procurement" });
//   }
// };

const db = require("../config/db");

// Submit procurement (already existing)
exports.submitProcurement = async (req, res) => {
  const { buyer_id,worker_id, farmer_id, crop_id, quantity, unit } = req.body;

  if (!buyer_id || !farmer_id || !crop_id || !quantity || !unit) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO procurement_requests (buyer_id, worker_id, farmer_id, crop_id, quantity, unit_type)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [buyer_id, worker_id, farmer_id, crop_id, quantity, unit]
    );

    res.status(201).json({ message: "Procurement submitted", request_id: result.insertId });
  } catch (err) {
    console.error("Procurement submit error:", err);
    res.status(500).json({ error: "Failed to submit procurement" });
  }
};

// Get unpriced procurements for a buyer
exports.getUnpricedProcurements = async (req, res) => {
  const { buyer_id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT pr.request_id, pr.quantity, pr.unit_type, pr.created_at,
              f.farmer_name AS farmer_name, c.crop_name
       FROM procurement_requests pr
       JOIN farmers f ON pr.farmer_id = f.farmer_id
       JOIN crops c ON pr.crop_id = c.crop_id
       WHERE pr.buyer_id = ? AND pr.status = 'pending'`,
      [buyer_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("Fetch unpriced procurements error:", err);
    res.status(500).json({ error: "Failed to fetch procurements" });
  }
};

// Finalize procurement by adding cost
exports.finalizeProcurement = async (req, res) => {
  const { request_id, cost_per_unit, unit_type, quantity } = req.body;

  if (!request_id || !cost_per_unit || !unit_type || !quantity) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [[request]] = await conn.query(
      `SELECT * FROM procurement_requests WHERE request_id = ?`,
      [request_id]
    );

    if (!request) {
      await conn.rollback();
      return res.status(404).json({ error: "Procurement request not found" });
    }

    const qty_field = unit_type === "quintal" ? "qty_in_quintals" : "qty_in_kgs";
    const cost_field = unit_type === "quintal" ? "cost_per_quintal" : "cost_per_kg";
    const amount = parseFloat(cost_per_unit) * parseFloat(quantity);

    await conn.query(
      `INSERT INTO entries (buyer_id, worker_id, farmer_id, crop_id, ${qty_field}, ${cost_field}, amount)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        request.buyer_id,
        request.worker_id,
        request.farmer_id,
        request.crop_id,
        quantity,
        cost_per_unit,
        amount
      ]
    );

    await conn.query(
      `INSERT INTO payment_dues (buyer_id, farmer_id, crop_id, ${qty_field}, amount, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [
        request.buyer_id,
        request.farmer_id,
        request.crop_id,
        quantity,
        amount
      ]
    );

    await conn.query(
      `UPDATE procurement_requests SET status = 'approved' WHERE request_id = ?`,
      [request_id]
    );

    await conn.commit();
    res.json({ message: "Procurement finalized" });
  } catch (err) {
    await conn.rollback();
    console.error("Finalize procurement error:", err);
    res.status(500).json({ error: "Failed to finalize procurement" });
  } finally {
    conn.release();
  }
};
