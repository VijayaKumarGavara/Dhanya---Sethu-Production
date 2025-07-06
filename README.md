# 🌾 Dhanya-Sethu — Digital Grain Procurement Platform

**Dhanya-Sethu** (ధాన్యసేతు) is a full-stack web application built to digitize and streamline the grain procurement process. It empowers **farmers**, **buyers**, **workers**, and **agri-shops** by making crop procurement, payment tracking, and agri-input purchases efficient, transparent, and accessible.

> “Dhanya” means grain or crop, and “Sethu” means bridge — symbolizing the platform's core purpose of connecting farmers with trusted buyers and service providers.

---

## 🚀 Features

### 🧑‍🌾 Farmer Portal
- View procurement requests with crop-wise and buyer-wise data.
- Track quantity sold and cost/payment status.
- Weather updates based on village/location.
- View tractor work records (if applicable & still in development phase).
- View their Purchases (seeds, fertilizers, pesticides) from the local Agri Dealers (Still in the Development Phase).

### 🧑‍💼 Buyer Portal
- Buye the crops from the farmers with Farmer Aadhars.
- Approve procurement requests from workers.
- Add cost per unit and finalize deals.
- Manage crop settings, view transactions, and handle farmer payments.

### 🧑‍🔧 Worker Portal
- Worked under Buyers registerd by Buyers.
- Fetch farmer by Aadhaar.
- Enter procurement details based on crop unit settings (kg/quintal).
- Submit procurement requests without pricing.

### 🛒 Agri-Input Shops (New Feature)
- Register purchases of seeds/fertilizers made by farmers.
- Farmers can view dues and pay accordingly.

### 🌦️ Weather Integration
- Fetch accurate weather based on GPS coordinates.
- Past 2 days + next 7 days forecast (planned).
- Uses [WeatherAPI.com] or [IndianAPI] (configurable).

---

## 🏗️ Tech Stack

| Layer         | Tech Used                |
|---------------|--------------------------|
| Frontend      | HTML, CSS, JavaScript    |
| Backend       | Node.js, Express.js      |
| Database      | MySQL                    |
| Session Store | Redis (for buyers/workers)|
| Deployment    | Render (free-tier)       |
| Weather API   | WeatherAPI.com / IndianAPI |

---



