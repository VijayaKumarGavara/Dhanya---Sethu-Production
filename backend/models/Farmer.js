// const db = require('../config/db'); // your mysql2 connection

// exports.registerFarmer = (farmer, callback) => {
//   const sql = "INSERT INTO farmers (farmer_id, farmer_name, farmer_phone_num, farmer_aadhar_num, farmer_village, photo) VALUES (?, ?, ?, ?, ?, ?)";

//   const values = [
//     farmer.farmer_id,
//     farmer.farmer_name,
//     farmer.farmer_phone_num,
//     farmer.farmer_aadhar_num,
//     farmer.farmer_village,
//     farmer.photo
//   ];

//   db.query(sql, values, callback);
// };

// exports.getFarmerByAadhar = (aadhar, callback) => {
//   const query = 'SELECT * FROM farmers WHERE farmer_aadhar_num = ?';
//   db.query(query, [aadhar], callback);
// };

// exports.getFarmerById=(id,callback)=>{
//   const q = "SELECT * FROM farmers WHERE farmer_id = ?";
//   db.query(q,[id],callback);
// }

// exports.getSellingRecordsByFarmer = (farmer_id) => {
//   return new Promise((resolve, reject) => {
//     // const sql = `
//     //   SELECT
//     //     b.buyer_name AS buyer_name,
//     //     c.crop_name AS crop_name,
//     //     e.qty_in_kgs AS qty,
//     //     'kg' AS unit,
//     //     e.cost_per_kg AS cost_per_unit,
//     //     e.amount,
//     //     pd.status AS payment_status
//     //   FROM entries e
//     //   JOIN buyers b ON b.buyer_id = e.buyer_id
//     //   JOIN crops c ON c.crop_id = e.crop_id
//     //   LEFT JOIN payment_dues pd 
//     //     ON pd.buyer_id = e.buyer_id 
//     //     AND pd.farmer_id = e.farmer_id 
//     //     AND pd.crop_id = e.crop_id
//     //   WHERE e.farmer_id = ?
//     // `;
//     const sql =
//         `SELECT
//       b.buyer_name,
//       c.crop_name,
//       bcs.default_unit AS unit,
      
//       CASE bcs.default_unit
//         WHEN 'kg' THEN e.qty_in_kgs
//         WHEN 'quintal' THEN e.qty_in_quintals
//       END AS qty,
      
//       CASE bcs.default_unit
//         WHEN 'kg' THEN e.cost_per_kg
//         WHEN 'quintal' THEN e.cost_per_quintal
//       END AS cost_per_unit,
      
//       CASE bcs.default_unit
//         WHEN 'kg' THEN e.qty_in_kgs * e.cost_per_kg
//         WHEN 'quintal' THEN e.qty_in_quintals * e.cost_per_quintal
//       END AS amount,

//       pd.status AS payment_status

//     FROM entries e
//     JOIN buyers b ON b.buyer_id = e.buyer_id
//     JOIN crops c ON c.crop_id = e.crop_id
//     JOIN buyer_crop_settings bcs ON bcs.buyer_id = e.buyer_id AND bcs.crop_id = e.crop_id
//     LEFT JOIN (
//       SELECT buyer_id, farmer_id, crop_id, MAX(status) AS status
//       FROM payment_dues
//       GROUP BY buyer_id, farmer_id, crop_id
//     ) pd ON pd.buyer_id = e.buyer_id AND pd.farmer_id = e.farmer_id AND pd.crop_id = e.crop_id

//     WHERE e.farmer_id = ?
//     `
//     db.query(sql, [farmer_id], (err, results) => {
//       if (err) {
//         console.error("❌ Database error in getSellingRecordsByFarmer:", err);
//         return reject(err);
//       }
//       // console.log("✅ Selling Records from DB:", results);
//       resolve(results);
//     });
//   });
// };

const db = require('../config/db');

exports.registerFarmer = async (farmer) => {
  const sql = `
    INSERT INTO farmers 
    (farmer_id, farmer_name, farmer_phone_num, farmer_aadhar_num, farmer_village, photo)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [
    farmer.farmer_id,
    farmer.farmer_name,
    farmer.farmer_phone_num,
    farmer.farmer_aadhar_num,
    farmer.farmer_village,
    farmer.photo
  ];
  await db.query(sql, values); // await the query
};

exports.getFarmerByAadhar = async (aadhar) => {
  const [rows] = await db.query('SELECT * FROM farmers WHERE farmer_aadhar_num = ?', [aadhar]);
  return rows;
};

exports.getFarmerById = async (id) => {
  const [rows] = await db.query('SELECT * FROM farmers WHERE farmer_id = ?', [id]);
  return rows;
};

exports.getSellingRecordsByFarmer = async (farmer_id) => {
  const sql = `
    SELECT
      b.buyer_name,
      c.crop_name,
      bcs.default_unit AS unit,
      CASE bcs.default_unit
        WHEN 'kg' THEN e.qty_in_kgs
        WHEN 'quintal' THEN e.qty_in_quintals
      END AS qty,
      CASE bcs.default_unit
        WHEN 'kg' THEN e.cost_per_kg
        WHEN 'quintal' THEN e.cost_per_quintal
      END AS cost_per_unit,
      CASE bcs.default_unit
        WHEN 'kg' THEN e.qty_in_kgs * e.cost_per_kg
        WHEN 'quintal' THEN e.qty_in_quintals * e.cost_per_quintal
      END AS amount,
      pd.status AS payment_status
    FROM entries e
    JOIN buyers b ON b.buyer_id = e.buyer_id
    JOIN crops c ON c.crop_id = e.crop_id
    JOIN buyer_crop_settings bcs ON bcs.buyer_id = e.buyer_id AND bcs.crop_id = e.crop_id
    LEFT JOIN (
      SELECT buyer_id, farmer_id, crop_id, MAX(status) AS status
      FROM payment_dues
      GROUP BY buyer_id, farmer_id, crop_id
    ) pd ON pd.buyer_id = e.buyer_id AND pd.farmer_id = e.farmer_id AND pd.crop_id = e.crop_id
    WHERE e.farmer_id = ?
  `;

  const [results] = await db.query(sql, [farmer_id]);
  return results;
};


exports.getSellingRecordsByFarmerNew = async (farmer_id) => {
  const sql = `
    SELECT
      e.date,
      e.entry_id,
      c.crop_id,
      c.crop_name,
      b.buyer_id,
      b.buyer_name,
      bcs.default_unit AS unit,
      
      CASE bcs.default_unit
        WHEN 'kg' THEN e.qty_in_kgs
        WHEN 'quintal' THEN e.qty_in_quintals
      END AS qty,

      CASE bcs.default_unit
        WHEN 'kg' THEN e.cost_per_kg
        WHEN 'quintal' THEN e.cost_per_quintal
      END AS cost_per_unit,

      CASE bcs.default_unit
        WHEN 'kg' THEN e.qty_in_kgs * e.cost_per_kg
        WHEN 'quintal' THEN e.qty_in_quintals * e.cost_per_quintal
      END AS amount,
      fcd.qty_in_quintals,
      fcd.qty_in_kgs,
      fcd.total_amount,
      fcd.paid_amount,
      (fcd.total_amount - fcd.paid_amount) AS amount_due,
      fcd.payment_status AS payment_status

    FROM entries e
    JOIN crops c ON c.crop_id = e.crop_id
    JOIN buyers b ON b.buyer_id = e.buyer_id
    JOIN buyer_crop_settings bcs ON bcs.buyer_id = e.buyer_id AND bcs.crop_id = e.crop_id
    LEFT JOIN farmer_crop_dues fcd
      ON fcd.farmer_id = e.farmer_id AND fcd.crop_id = e.crop_id AND fcd.buyer_id = e.buyer_id

    WHERE e.farmer_id = ?
    ORDER BY c.crop_name, b.buyer_name, e.entry_id
  `;

  const [results] = await db.query(sql, [farmer_id]);
  return results;
};

exports.getProcurementRequestsByFarmer = async (farmer_id) => {
  const [rows] = await db.execute(
    `SELECT 
      pr.quantity, pr.unit_type, pr.status, pr.created_at,
      c.crop_name,
      b.buyer_name, b.buyer_id
     FROM procurement_requests pr
     JOIN crops c ON pr.crop_id = c.crop_id
     JOIN buyers b ON pr.buyer_id = b.buyer_id
     WHERE pr.farmer_id = ?
     ORDER BY pr.created_at DESC`,
    [farmer_id]
  );

  return rows;
};