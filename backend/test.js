const mysql=require('mysql2');
require('dotenv').config();
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err.stack);
        return;
    }
    console.log('✅ Connected to database as ID:', db.threadId);
});
const q=`select * from farmers`;
db.query(q,(data,err)=>{
    if(err)console.log(err);
    console.log(data);
})