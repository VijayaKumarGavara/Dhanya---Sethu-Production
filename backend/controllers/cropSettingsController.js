const db = require('../config/db'); // or your DB wrapper

exports.getBuyerCropSettings = async (req, res) => {
  const { buyer_id } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT crop_name, default_unit FROM buyer_crop_settings WHERE buyer_id = ?',
      [buyer_id]
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching crop settings:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
