const db = require('../config/db');

async function getCropSettingsByBuyerId(buyer_id) {
  const [rows] = await db.query(
    'SELECT crop_id, crop_name, default_unit FROM buyer_crop_settings WHERE buyer_id = ?',
    [buyer_id]
  );
  return rows;
}

module.exports = { getCropSettingsByBuyerId };
