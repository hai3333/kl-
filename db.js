const mysql = require('mysql2/promise');
require('dotenv').config();

// 创建数据库连接池
const pool = mysql.createPool({
  host: '192.168.2.35',
  port: 3306,
  user:  'root',
  password:  '123qwe123', 
  database:  'kailiang_portal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // 关键配置：强制使用 utf8mb4，防止中文乱码
  charset: 'utf8mb4' 
});

module.exports = pool;