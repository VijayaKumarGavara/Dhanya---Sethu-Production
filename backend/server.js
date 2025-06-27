const express = require('express');
const fs = require('fs');
const path=require('path');
const mysql=require('mysql2');
require('dotenv').config();
const app = express();
const farmerRoutes = require('./routes/farmerRoutes');
const workerRoutes = require('./routes/workerRoutes');
const buyerRoutes = require('./routes/buyerRoutes');
const cropSettingsRoutes = require('./routes/cropSettingsRoutes')
const procurementRoutes = require('./routes/procurementRoutes');
const paymentRoutes = require("./routes/paymentRoutes");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/farmer', farmerRoutes);
app.use('/api/worker',workerRoutes);
app.use('/api/buyer', buyerRoutes);
app.use('/api', cropSettingsRoutes);
app.use('/api/procurements', procurementRoutes);
app.use("/api/payment", paymentRoutes);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../frontend')));


const dir = './uploads/farmers';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/login',(req,res)=>{
  res.sendFile(path.join(__dirname, '../frontend/pages/login.html'));
})
app.get('/register',(req,res)=>{
  res.sendFile(path.join(__dirname, '../frontend/pages/register.html'));
})

app.get('/farmer/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/farmer/dashboard.html'));
});

app.get('/farmer/profile', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/farmer/profile.html'));
});

app.get('/farmer/records', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/farmer/records.html'));
});
app.get('/farmer/updated_records', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/farmer/records2.html'));
});
app.get('/farmer/weather_updates', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/farmer/weather_updates.html'));
});


app.get('/worker/buyings',(req,res)=>{
  res.sendFile(path.join(__dirname, '../frontend/pages/worker/buyings.html'));
})
app.get('/buyer/dashboard',(req,res)=>{
  res.sendFile(path.join(__dirname, '../frontend/pages/buyer/dashboard.html'));
})
app.get('/buyer/profile',(req,res)=>{
  res.sendFile(path.join(__dirname, '../frontend/pages/buyer/profile.html'));
})
app.get('/buyer/buyings',(req,res)=>{
  res.sendFile(path.join(__dirname, '../frontend/pages/buyer/buyings.html'));
})
app.get('/buyer/procurements',(req,res)=>{
  res.sendFile(path.join(__dirname, '../frontend/pages/buyer/procurement_request.html'));
})
app.get('/buyer/records',(req,res)=>{
  res.sendFile(path.join(__dirname,'../frontend/pages/buyer/purchase_records.html'));
})
app.get('/buyer/crop_settings',(req,res)=>{
  res.sendFile(path.join(__dirname,'../frontend/pages/buyer/crop_settings.html'));
})
app.get('/buyer/payment_dues',(req,res)=>{
  res.sendFile(path.join(__dirname,'../frontend/pages/buyer/payment_dues.html'));
})
app.get('/buyer/transactions',(req,res)=>{
  res.sendFile(path.join(__dirname,'../frontend/pages/buyer/transactions.html'));
})
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
