const db = require('../config/db'); 

exports.registerBuyer = async (buyer) => {
  const q = `INSERT INTO buyers (buyer_id, buyer_name, buyer_phone_num, buyer_village) 
             VALUES (?, ?, ?, ?)`;
  const values = [
    buyer.buyer_id,
    buyer.buyer_name,
    buyer.buyer_phone_num,
    buyer.buyer_village
  ];

  try {
    await db.query(q, values);
  } catch (err) {
    console.error('DB Error in registerBuyer:', err);
    throw err;
  }
};

exports.setCropSettings = async (buyer_id) => {
  const q = `
    INSERT INTO buyer_crop_settings (buyer_id, crop_id, crop_name, default_unit)
    VALUES 
      (?, 10, 'Mokka Jonna', 'quintal'),
      (?, 11, 'Paddy', 'quintal'),
      (?, 12, 'Mirchi', 'kg'),
      (?, 14, 'Ground Nut', 'quintal'),
      (?, 15, 'Pesalu', 'quintal'),
      (?, 16, 'Minimulu', 'quintal'),
      (?, 17, 'Vulavulu', 'quintal'),
      (?, 18, 'Solu', 'quintal')
  `;

  try {
    await db.query(q, Array(8).fill(buyer_id)); // [buyer_id, buyer_id, ..., 8 times]
  } catch (err) {
    console.error('DB Error in setCropSettings:', err);
    throw err;
  }
};


exports.getBuyerByPhone = async (phone) => {
  const q = "SELECT * FROM buyers WHERE buyer_phone_num = ?";
  try {
    const [rows] = await db.query(q, [phone]);
    return rows[0]; // assuming phone numbers are unique
  } catch (err) {
    console.error('DB Error in getBuyerByPhone:', err);
    throw err;
  }
};

exports.getBuyerById = async (id) => {
  const q = "SELECT * FROM buyers WHERE buyer_id = ?";
  try {
    const [rows] = await db.query(q, [id]);
    return rows[0];
  } catch (err) {
    console.error('DB Error in getBuyerById:', err);
    throw err;
  }
};

exports.getCropSettingsByBuyerId = async (buyer_id) => {
  const q = 'SELECT crop_id, crop_name, default_unit FROM buyer_crop_settings WHERE buyer_id = ?';
  try {
    const [rows] = await db.query(q, [buyer_id]);
    return rows;
  } catch (err) {
    console.error('DB Error in getCropSettingsByBuyerId:', err);
    throw err;
  }
};

exports.getPurchaseRecords = async (buyer_id) => {
  const q = `
    SELECT 
      e.date,
      f.farmer_name,
      c.crop_name,
      CASE 
        WHEN e.qty_in_kgs IS NOT NULL AND e.qty_in_kgs > 0 THEN CONCAT(e.qty_in_kgs, ' kg')
        WHEN e.qty_in_quintals IS NOT NULL AND e.qty_in_quintals > 0 THEN CONCAT(e.qty_in_quintals, ' quintal')
        ELSE 'N/A'
      END AS quantity,
      CASE 
        WHEN e.cost_per_kg IS NOT NULL AND e.cost_per_kg > 0 THEN CONCAT(e.cost_per_kg, ' /kg')
        WHEN e.cost_per_quintal IS NOT NULL AND e.cost_per_quintal > 0 THEN CONCAT(e.cost_per_quintal, ' /quintal')
        ELSE 'N/A'
      END AS cost_per_unit,
      e.amount
    FROM entries e
    JOIN crops c ON e.crop_id = c.crop_id
    JOIN farmers f ON f.farmer_id=e.farmer_id
    WHERE e.buyer_id = ?
    ORDER BY e.date DESC
  `;

  try {
    const [rows] = await db.query(q, [buyer_id]);
    // console.log(rows);
    return rows;
  } catch (err) {
    console.error('DB Error in getPurchaseRecords:', err);
    throw err;
  }
};

// exports.getPurchaseRecords = async (buyer_id) => {
//   const q = `
//     SELECT e.date, c.crop_name, e.qty_in_kgs, e.qty_in_quintals, 
//            e.cost_per_kg, e.cost_per_quintal, e.amount
//     FROM entries e
//     JOIN crops c ON e.crop_id = c.crop_id
//     WHERE e.buyer_id = ?
//     ORDER BY e.date DESC
//   `;
//   try {
//     const [rows] = await db.query(q, [buyer_id]);
//     return rows;
//   } catch (err) {
//     console.error('DB Error in getPurchaseRecords:', err);
//     throw err;
//   }
// };

exports.getTransactions = async (buyer_id) => {
  const q = `
    SELECT 
      f.farmer_name,
      c.crop_name,
      p.amount,
      p.paid_at
    FROM payment_logs p
    JOIN farmers f ON p.farmer_id = f.farmer_id
    JOIN crops c ON p.crop_id = c.crop_id
    WHERE p.buyer_id = ?
    ORDER BY p.paid_at DESC
  `;
  try {
    const [rows] = await db.query(q, [buyer_id]);
    return rows;
  } catch (err) {
    console.error('DB Error in getTransactions:', err);
    throw err;
  }
};

