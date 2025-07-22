const path = require('path');
const fs = require('fs');
const Farmer = require('../models/Farmer');
const cloudinary = require('../config/cloudinary');
const generateCustomUserId = require('../utils/idGenerator');

// exports.registerFarmer = async (req, res) => {
//   const { name, phone, aadhar, village } = req.body;
//   const tempFile = req.file;

//   if (!name || !phone || !aadhar || !tempFile) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   // Step 1: Generate unique farmer_id
//   async function generateUniqueFarmerId() {
//     let id;
//     let exists = true;

//     while (exists) {
//       id = generateCustomUserId('farmer');
//       await new Promise((resolve, reject) => {
//         Farmer.getFarmerById(id, (err, result) => {
//           if (err) return reject(err);
//           exists = result && result.length > 0;
//           resolve();
//         });
//       });
//     }
//     return id;
//   }

//   try {
//     const farmer_id = await generateUniqueFarmerId();

//     // Step 2: Rename the file with farmer_id
//     const newFileName = `${farmer_id}${path.extname(tempFile.originalname)}`;
//     const newFilePath = path.join(tempFile.destination, newFileName);
    
//     fs.renameSync(tempFile.path, newFilePath); // Rename temp file to farmer_id

//     // Step 3: Create DB entry
//     const farmer = {
//       farmer_id,
//       farmer_name: name,
//       farmer_phone_num: phone,
//       farmer_aadhar_num: aadhar,
//       farmer_village: village || '',
//       photo: newFileName
//     };

//     Farmer.registerFarmer(farmer, (err, result) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ error: 'Database error' });
//       }
//       res.status(201).json({ message: 'Farmer registered', farmer_id });
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// };


// exports.loginFarmer = (req, res) => {
//   const { aadhar, phone } = req.body;

//   Farmer.getFarmerByAadhar(aadhar, (err, results) => {
//   if (err) return res.status(500).json({ error: 'DB error' });
//   if (results.length === 0) return res.status(401).json({ error: 'Farmer not found' });

//   const farmer = results[0];
//   if (farmer.farmer_phone_num !== phone) {
//     return res.status(401).json({ error: 'Invalid phone number' });
//   }

//   res.status(200).json({ message: 'Login success', farmer });
//   });

// };


exports.getSellingRecords = async (req, res) => {
  try {
    const { farmer_id } = req.query;
    if (!farmer_id) {
      return res.status(400).json({ error: "Farmer ID is required" });
    }

    const records = await Farmer.getSellingRecordsByFarmer(farmer_id);

    if (!Array.isArray(records)) {
      console.error("❌ Expected array but got:", records);
      return res.status(500).json({ error: "Invalid records format" });
    }

    res.json({ records });
  } catch (error) {
    console.error("❌ Error fetching selling records:", error);
    res.status(500).json({ error: "Failed to fetch the selling records" });
  }
};


// exports.registerFarmer = async (req, res) => {
//   const { name, phone, aadhar, village } = req.body;
//   const tempFile = req.file;

//   if (!name || !phone || !aadhar || !tempFile) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   async function generateUniqueFarmerId() {
//     let id, exists = true;
//     while (exists) {
//       id = generateCustomUserId('farmer');
//       const existing = await Farmer.getFarmerById(id);
//       exists = existing.length > 0;
//     }
//     return id;
//   }

//   try {
//     const farmer_id = await generateUniqueFarmerId();
//     const newFileName = `${farmer_id}${path.extname(tempFile.originalname)}`;
//     const newFilePath = path.join(tempFile.destination, newFileName);
//     fs.renameSync(tempFile.path, newFilePath);

//     const farmer = {
//       farmer_id,
//       farmer_name: name,
//       farmer_phone_num: phone,
//       farmer_aadhar_num: aadhar,
//       farmer_village: village || '',
//       photo: newFileName
//     };

//     await Farmer.registerFarmer(farmer);
//     res.status(201).json({ message: 'Farmer registered', farmer});

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// };

// Registration using cloudinary:

exports.registerFarmer = async (req, res) => {
  const { name, phone, aadhar, village } = req.body;
  const tempFile = req.file;

  if (!name || !phone || !aadhar || !tempFile) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  async function generateUniqueFarmerId() {
    let id, exists = true;
    while (exists) {
      id = generateCustomUserId('farmer');
      const existing = await Farmer.getFarmerById(id);
      exists = existing.length > 0;
    }
    return id;
  }

  try {
    const farmer_id = await generateUniqueFarmerId();

    // Upload to Cloudinary
    // const extension = path.extname(tempFile.originalname); // e.g., ".jpg"
    // const publicId = `farmers/${farmer_id}`; // Cloudinary folder + custom file name
    // const cloudinaryRes = await cloudinary.uploader.upload(tempFile.path, {
    //   public_id: publicId, // will result in farmers/FARM1234567890
    //   overwrite: true,     // allows replacing if exists
    //   resource_type: "image"
    // });
    const extension = path.extname(tempFile.originalname).toLowerCase();
    const fileName = `${farmer_id}${extension}`; // e.g., FARM1234567890.jpg

    const cloudinaryRes = await cloudinary.uploader.upload(tempFile.path, {
      public_id: `${farmer_id}`, // ✅ store in "farmers" folder
      // public_id: fileName, // ✅ include folder + filename + extension
      folder:'farmers',
      overwrite: true,
      resource_type: "image"
    });
    // console.log(cloudinaryRes);
    const farmer = {
      farmer_id,
      farmer_name: name,
      farmer_phone_num: phone,
      farmer_aadhar_num: aadhar,
      farmer_village: village || '',
      photo: fileName  // ✅ only store "FARM1234567890.jpg" in DB
    };
    const fs = require('fs');
    fs.unlinkSync(tempFile.path);

    // const farmer = {
    //   farmer_id,
    //   farmer_name: name,
    //   farmer_phone_num: phone,
    //   farmer_aadhar_num: aadhar,
    //   farmer_village: village || '',
    //   photo: `${farmer_id}${path.extname(tempFile.originalname)}`
    //   // photo: result.secure_url
    // };

    await Farmer.registerFarmer(farmer);
    res.status(201).json({ message: 'Farmer registered', farmer });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.loginFarmer = async (req, res) => {
  const { aadhar, phone } = req.body;
  try {
    const results = await Farmer.getFarmerByAadhar(aadhar);
    if (results.length === 0) return res.status(401).json({ error: 'Farmer not found' });

    const farmer = results[0];
    if (farmer.farmer_phone_num !== phone) {
      return res.status(401).json({ error: 'Invalid phone number' });
    }

    res.status(200).json({ message: 'Login success', farmer });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: 'DB error' });
  }
};


exports.getSellingRecordsNew = async (req, res) => {
  try {
    const { farmer_id } = req.query;
    if (!farmer_id) {
      return res.status(400).json({ error: "Farmer ID is required" });
    }

    const records = await Farmer.getSellingRecordsByFarmerNew(farmer_id);
    // console.log(records);
    if (!Array.isArray(records)) {
      console.error("❌ Expected array but got:", records);
      return res.status(500).json({ error: "Invalid records format" });
    }

    res.json({ records });
  } catch (error) {
    console.error("❌ Error fetching selling records:", error);
    res.status(500).json({ error: "Failed to fetch the selling records" });
  }
};

exports.getProcurementRequests = async (req, res) => {
  const { farmer_id } = req.query;

  if (!farmer_id) {
    return res.status(400).json({ error: 'Farmer ID is required' });
  }

  try {
    const requests = await Farmer.getProcurementRequestsByFarmer(farmer_id);
    res.json({ requests });
  } catch (err) {
    console.error('Error fetching procurement requests:', err);
    res.status(500).json({ error: 'Failed to fetch procurement requests' });
  }
};