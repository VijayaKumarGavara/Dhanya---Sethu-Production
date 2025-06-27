// backend/controllers/workerController.js
const Buyer = require('../models/Buyer');
const generateCustomUserId = require('../utils/idGenerator');

exports.registerBuyer = async (req, res) => {
  const { buyer_name, buyer_phone_num, buyer_village } = req.body;

  if (!buyer_name || !buyer_phone_num || !buyer_village) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const buyer = await Buyer.getBuyerByPhone(buyer_phone_num);

    if (buyer) {
      // return res.status(409).json({
      //   message: 'Buyer is already registered with this phone number, please login'
      // });
      return res.status(400).json({ code: 'BUYER_EXISTS', message: 'Buyer is already registered...' });
    }

    // Generate unique buyer ID
    async function generateUniqueBuyerId() {
      let id;
      let exists = true;

      while (exists) {
        id = generateCustomUserId('buyer');
        const existingBuyer = await Buyer.getBuyerById(id);
        exists = !!existingBuyer;
      }

      return id;
    }

    const buyer_id = await generateUniqueBuyerId();

    const newBuyer = {
      buyer_id,
      buyer_name,
      buyer_phone_num,
      buyer_village
    };

    await Buyer.registerBuyer(newBuyer);
    await Buyer.setCropSettings(buyer_id);
    const cropSettings = await Buyer.getCropSettingsByBuyerId(buyer_id); // You'll define this model
    
    res.status(200).json({
      message: 'Registration successful',
      // buyer_name: newBuyer.buyer_name
      buyer:newBuyer,
      crop_settings:cropSettings
    });

  } catch (err) {
    console.error('Error in registerBuyer:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.loginBuyer = async (req, res) => {
  const { buyer_phone_num, buyer_otp } = req.body;

  if (!buyer_phone_num) {
    return res.status(400).json({ error: 'Buyer phone number is required' });
  }
  // console.log(buyer_phone_num);
  try {
    const buyer = await Buyer.getBuyerByPhone(buyer_phone_num);
    // console.log(buyer);
    if (!buyer) {
      return res.status(404).json({ error: 'Phone number not registered as buyer' });
    }

    if (buyer_otp !== '123456') {
      return res.status(401).json({ error: 'Invalid OTP' });
    }
    const cropSettings = await Buyer.getCropSettingsByBuyerId(buyer.buyer_id); // You'll define this model
    
    // Successful login
    res.status(200).json({
      message: 'Login successful',
      // buyer_id: buyer.buyer_id,
      // buyer_name: buyer.buyer_name,
      // buyer_phone_num: buyer.buyer_phone_num
      buyer,
      crop_settings:cropSettings
    });

  } catch (err) {
    console.error('Error in loginBuyer:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getPurchaseRecords = async (req, res) => {
  const { buyer_id } = req.query;
  try {
    const records = await Buyer.getPurchaseRecords(buyer_id); // You’ll implement this
    // console.log(records);
    res.json(records);
    
  } catch (err) {
    console.error("Error fetching purchase records:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
