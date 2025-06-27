const pool = require("../config/db");

module.exports = {
  getUnpricedProcurements: async (buyer_id) => {
  const [rows] = await pool.query(
    `SELECT pr.request_id, pr.quantity, pr.unit_type, pr.created_at,
            f.farmer_name AS farmer_name, c.crop_name
     FROM procurement_requests pr
     JOIN farmers f ON pr.farmer_id = f.farmer_id
     JOIN crops c ON pr.crop_id = c.crop_id
     WHERE pr.buyer_id = ? AND pr.status = 'pending'`,
    [buyer_id]
  );
  return rows;
},

  // finalizeProcurement: async ({ request_id, cost_per_unit, unit_type, quantity }) => {
  //   const conn = await pool.getConnection();
  //   try {
  //     await conn.beginTransaction();

  //     // Get the full procurement request
  //     const [[req]] = await conn.query(`SELECT * FROM procurement_requests WHERE request_id = ?`, [request_id]);
  //     if (!req) throw new Error("Procurement request not found");

  //     const qty_field = unit_type === "quintal" ? "qty_in_quintals" : "qty_in_kgs";
  //     const cost_field = unit_type === "quintal" ? "cost_per_quintal" : "cost_per_kg";
  //     const amount = cost_per_unit * parseFloat(quantity);

  //     // Insert into entries table
  //     await conn.query(
  //       `INSERT INTO entries (date, buyer_id, worker_id, farmer_id, crop_id, ${qty_field}, ${cost_field}, amount)
  //        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  //       [
  //         req.created_at,
  //         req.buyer_id,
  //         req.worker_id,
  //         req.farmer_id,
  //         req.crop_id,
  //         quantity,
  //         cost_per_unit,
  //         amount
  //       ]
  //     );

  //     // Insert into payment_dues table
  //     await conn.query(
  //       `INSERT INTO payment_dues (buyer_id, farmer_id, crop_id, ${qty_field}, amount, status)
  //        VALUES (?, ?, ?, ?, ?, 'pending')`,
  //       [
  //         req.buyer_id,
  //         req.farmer_id,
  //         req.crop_id,
  //         quantity,
  //         amount
  //       ]
  //     );
  //     // Update procurement_request status to approved
  //     await conn.query(`UPDATE procurement_requests SET status = 'approved' WHERE request_id = ?`, [request_id]);

  //     await conn.commit();
  //     return { success: true };
  //   } catch (err) {
  //     await conn.rollback();
  //     throw err;
  //   } finally {
  //     conn.release();
  //   }
  // },
  finalizeProcurementNew: async ({ request_id, cost_per_unit, unit_type, quantity }) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Get the full procurement request
    const [[req]] = await conn.query(
      `SELECT * FROM procurement_requests WHERE request_id = ?`,
      [request_id]
    );
    if (!req) throw new Error("Procurement request not found");

    const qty_field = unit_type === "quintal" ? "qty_in_quintals" : "qty_in_kgs";
    const cost_field = unit_type === "quintal" ? "cost_per_quintal" : "cost_per_kg";
    const amount = cost_per_unit * parseFloat(quantity);

    // Insert into entries table
    await conn.query(
      `INSERT INTO entries (date, buyer_id, worker_id, farmer_id, crop_id, ${qty_field}, ${cost_field}, amount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.created_at,
        req.buyer_id,
        req.worker_id,
        req.farmer_id,
        req.crop_id,
        quantity,
        cost_per_unit,
        amount
      ]
    );
    console.log("📝 Inserting new record into farmer_crop_dues...");
    // Insert or update farmer_crop_dues
    const [[existingDue]] = await conn.query(
      `SELECT * FROM farmer_crop_dues 
       WHERE buyer_id = ? AND farmer_id = ? AND crop_id = ?`,
      [req.buyer_id, req.farmer_id, req.crop_id]
    );

    if (existingDue) {
      const newQty = parseFloat(existingDue[qty_field]) + parseFloat(quantity);
      const newTotalAmount = parseFloat(existingDue.total_amount) + amount;
      const newStatus =
        parseFloat(existingDue.amount_paid) >= newTotalAmount
          ? "paid"
          : parseFloat(existingDue.amount_paid) > 0
          ? "partial"
          : "pending";

      await conn.query(
        `UPDATE farmer_crop_dues 
         SET ${qty_field} = ?, total_amount = ?, status = ?
         WHERE buyer_id = ? AND farmer_id = ? AND crop_id = ?`,
        [newQty, newTotalAmount, newStatus, req.buyer_id, req.farmer_id, req.crop_id]
      );
    } else {
      await conn.query(
        `INSERT INTO farmer_crop_dues (buyer_id, farmer_id, crop_id, ${qty_field}, total_amount, amount_paid, status)
         VALUES (?, ?, ?, ?, ?, 0, 'pending')`,
        [req.buyer_id, req.farmer_id, req.crop_id, quantity, amount]
      );
    }
    console.log("Done done......");
    // Update procurement_request status to approved
    await conn.query(
      `UPDATE procurement_requests SET status = 'approved' WHERE request_id = ?`,
      [request_id]
    );

    await conn.commit();
    return { success: true };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
},

};

