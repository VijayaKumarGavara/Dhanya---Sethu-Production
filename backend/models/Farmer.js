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
