// backend/controllers/workerController.js
const Worker = require('../models/Worker');
const generateCustomUserId = require('../utils/idGenerator');

exports.registerWorker = async (req, res) => {
  // console.log("Received Worker Registration Body:", req.body);
  const { buyer_phone_num, worker_name, worker_phone_num, village, buyer_otp } = req.body;

  if (!buyer_phone_num || !worker_name || !worker_phone_num || !village || !buyer_otp) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Simulated OTP check (this should be improved later)
  if (buyer_otp !== "123456") {
    return res.status(401).json({ error: 'Invalid OTP' });
  }

  try {
    const buyer = await Worker.getBuyerByPhone(buyer_phone_num);

    if (!buyer) {
      return res.status(404).json({ error: 'Buyer not found with this phone number' });
    }

    // Generate unique worker ID
    async function generateUniqueWorkerId() {
      let id;
      let exists = true;

      while (exists) {
        id = generateCustomUserId('worker');
        const existingWorker = await Worker.getWorkerById(id);
        exists = !!existingWorker;
      }

      return id;
    }

    const worker_id = await generateUniqueWorkerId();

    const newWorker = {
      worker_id,
      buyer_id: buyer.buyer_id,
      worker_name,
      worker_phone_num,
      worker_village: village,
      buyer_phone_num
    };

    await Worker.registerWorker(newWorker);
    const cropSettings = await Worker.getCropSettingsByBuyerId(buyer.buyer_id); // You'll define this model
    //res.status(201).json({ message: 'Worker registered successfully', newWorker });
    // console.log(cropSettings);
    res.status(200).json({
    message: 'Registration successful',
    buyer_id: buyer.buyer_id,
    buyer_name: buyer.buyer_name,
    worker_id: newWorker.worker_id,
    worker_name: newWorker.worker_name,
    crop_settings:cropSettings
  });

  } catch (err) {
    console.error('Error in registerWorker:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// exports.loginWorker = async (req, res) => {
//   const { buyer_phone_num, worker_phone_num, worker_buyer_otp } = req.body;

//   if (!buyer_phone_num || !worker_phone_num || !worker_buyer_otp) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   // Static OTP check (mocking real OTP verification)
//   if (worker_buyer_otp !== '123456') {
//     return res.status(401).json({ error: "Invalid OTP" });
//   }

//   try {
//     const result = await Worker.getWorkerByPhone(worker_phone_num, buyer_phone_num);

//     if (!result || result.length === 0) {
//       return res.status(404).json({ error: "Worker not found for the given buyer" });
//     }

//     // You could set session info here if needed
//     //res.status(200).json({ message: "Login successful", worker: result[0] });
//     res.status(200).json({
//       message: 'Login successful',
//       buyer_name: buyer[0].buyer_name,
//       worker_name: worker[0].worker_name
//     });
//   } catch (err) {
//     console.error("Worker login error:", err);
//     res.status(500).json({ error: "Database error during login" });
//   }
// };



exports.loginWorker = async (req, res) => {
  const { buyer_phone_num, worker_phone_num, worker_buyer_otp } = req.body;

  if (worker_buyer_otp !== '123456') {
    return res.status(401).json({ error: 'Invalid OTP' });
  }

  try {
    const buyer = await Worker.getBuyerByPhone(buyer_phone_num);
    if (!buyer) {
      return res.status(404).json({ error: 'Buyer not found' });
    }

    const workerRows = await Worker.getWorkerByPhoneAndBuyer(worker_phone_num, buyer_phone_num);
    if (!workerRows || workerRows.length === 0) {
      return res.status(404).json({ error: 'Worker not found or not linked to buyer' });
    }

    const worker = workerRows[0];
    const cropSettings = await Worker.getCropSettingsByBuyerId(buyer.buyer_id); // You'll define this model
    // console.log(cropSettings);

    res.status(200).json({
      message: 'Login successful',
      buyer_id: buyer.buyer_id,
      buyer_name: buyer.buyer_name,
      worker_id: worker.worker_id,
      worker_name: worker.worker_name,
      crop_settings:cropSettings
    });

  } catch (err) {
    console.error("Worker login error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
