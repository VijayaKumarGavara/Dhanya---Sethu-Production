// const db = require('../config/db'); // your mysql2 connection

// exports.registerWorker = (worker, callback) => {
//   const sql = "INSERT INTO workers (worker_id, buyer_id, worker_name, worker_phone_num,  worker_village, buyer_phone_num) VALUES (?, ?, ?, ?, ?, ?)";

//   const values = [
//     worker.worker_id,
//     worker.buyer_id,
//     worker.worker_name,
//     worker.worker_phone_num,
//     worker.worker_village,
//     worker.buyer_phone_num
//   ];

//   db.query(sql, values, callback);
// };

// exports.getBuyerByPhone = (phone, callback)=>{
//   const q = "SELECT * FROM farmers WHERE buyer_phone_num = ?";
//   db.query(q,[phone],callback);
// }

// exports.getWorkerById=(id,callback)=>{
//   const q = "SELECT * FROM workers WHERE worker_id = ?";
//   db.query(q,[id],callback);
// }

// backend/models/Worker.js
const db = require('../config/db'); // mysql2 pool with .promise()

exports.registerWorker = async (worker) => {
  const sql = `
    INSERT INTO workers (
      worker_id, buyer_id, worker_name, 
      worker_phone_num, worker_village, buyer_phone_num
    ) VALUES (?, ?, ?, ?, ?, ?)`;

  const values = [
    worker.worker_id,
    worker.buyer_id,
    worker.worker_name,
    worker.worker_phone_num,
    worker.worker_village,
    worker.buyer_phone_num
  ];

  try {
    const [result] = await db.query(sql, values);
    return result;
  } catch (err) {
    console.error('DB Error in registerWorker:', err);
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

exports.getWorkerByPhone = async (phone) => {
  const q = "SELECT * FROM workers WHERE worker_phone_num = ?";
  try {
    const [rows] = await db.query(q, [phone]);
    return rows[0]; // assuming phone numbers are unique
  } catch (err) {
    console.error('DB Error in getWorkerByPhone:', err);
    throw err;
  }
};

exports.getWorkerByPhoneAndBuyer = async (worker_phone_num, buyer_phone_num) => {
  const q = "SELECT * FROM workers WHERE worker_phone_num = ? AND buyer_phone_num = ?";
  try {
    const [rows] = await db.query(q, [worker_phone_num, buyer_phone_num]);
    return rows;
  } catch (err) {
    console.error('DB Error in getWorkerByPhoneAndBuyer:', err);
    throw err;
  }
};


exports.getWorkerById = async (id) => {
  const q = "SELECT * FROM workers WHERE worker_id = ?";
  try {
    const [rows] = await db.query(q, [id]);
    return rows[0];
  } catch (err) {
    console.error('DB Error in getWorkerById:', err);
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

