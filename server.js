const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors()); 
app.use(bodyParser.json({ limit: '50mb' })); 
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// 数据库初始化函数
const initDB = async () => {
  try {
    // 1. 测试连接
    await db.query('SELECT 1');
    console.log('✅ MySQL Database connected successfully.');
    
    // 2. 自动创建项目表 (如果不存在)
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        url VARCHAR(2048) NOT NULL,
        category VARCHAR(100) NOT NULL,
        image_url LONGTEXT,
        created_at BIGINT NOT NULL
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `;
    await db.query(createTableQuery);
    console.log('✅ Database initialized: "projects" table checked/created.');
  } catch (err) {
    console.error('❌ Database initialization failed:', err.message);
    console.error('👉 Please ensure MySQL is running and a database named "kailiang_portal" exists.');
    console.error('👉 Check credentials in db.js or .env file.');
  }
};

// --- API 路由 ---

// 1. 获取所有项目
app.get('/api/projects', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
    const projects = rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      description: row.description,
      url: row.url,
      category: row.category,
      imageUrl: row.image_url,
      createdAt: Number(row.created_at)
    }));
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// 2. 添加新项目
app.post('/api/projects', async (req, res) => {
  const { name, description, url, category, imageUrl } = req.body;
  
  if (!name || !url || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const createdAt = Date.now();

  try {
    const [result] = await db.execute(
      'INSERT INTO projects (name, description, url, category, image_url, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, url, category, imageUrl || '', createdAt]
    );

    const newProject = {
      id: result.insertId.toString(),
      name,
      description,
      url,
      category,
      imageUrl,
      createdAt
    };

    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({ error: 'Failed to add project' });
  }
});

// 3. 删除项目
app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM projects WHERE id = ?', [id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// 启动服务器前初始化数据库
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
});