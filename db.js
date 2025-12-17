const mysql = require('mysql2/promise');
require('dotenv').config();

// 创建数据库连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456', 
  database: process.env.DB_NAME || 'kailiang_portal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // 关键配置：强制使用 utf8mb4，防止中文乱码
  charset: 'utf8mb4' 
});

module.exports = pool;