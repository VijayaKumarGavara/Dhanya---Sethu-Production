const pool = require('../config/db');

module.exports = {
  // Get all crop dues for a buyer (grouped by farmer and crop)
  getFarmerCropDues: async (buyer_id) => {
    const [rows] = await pool.query(
      `SELECT 
         fcd.farmer_id, f.farmer_name, c.crop_id, c.crop_name,
         fcd.qty_in_kgs, fcd.qty_in_quintals,
         fcd.total_amount, fcd.paid_amount,
         (fcd.total_amount - fcd.paid_amount) AS amount_due,
         fcd.payment_status
       FROM farmer_crop_dues fcd
       JOIN crops c ON c.crop_id = fcd.crop_id
       JOIN farmers f ON f.farmer_id = fcd.farmer_id
       WHERE fcd.buyer_id = ?
       ORDER BY fcd.payment_status, f.farmer_name, c.crop_name`,
      [buyer_id]
    );
    return rows;
  },

  // Make payment against a specific due
  makePayment: async ({ buyer_id, farmer_id, crop_id, amount }) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [[due]] = await conn.query(
        `SELECT * FROM farmer_crop_dues 
         WHERE buyer_id = ? AND farmer_id = ? AND crop_id = ?`,
        [buyer_id, farmer_id, crop_id]
      );

      if (!due) throw new Error("Due record not found");

      const newPaid = parseFloat(due.paid_amount) + parseFloat(amount);
      const newStatus =
        newPaid >= due.total_amount ? "paid" :
        newPaid > 0 ? "partial" : "pending";

      // Update dues table
      await conn.query(
        `UPDATE farmer_crop_dues
         SET paid_amount = ?, payment_status = ?
         WHERE buyer_id = ? AND farmer_id = ? AND crop_id = ?`,
        [newPaid, newStatus, buyer_id, farmer_id, crop_id]
      );

      // Insert payment log
      await conn.query(
        `INSERT INTO payment_logs (buyer_id, farmer_id, crop_id, amount, paid_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [buyer_id, farmer_id, crop_id, amount]
      );

      await conn.commit();
      return { success: true };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
};
