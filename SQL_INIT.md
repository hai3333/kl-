# 数据库初始化指南 (Database Setup)

如果自动初始化出现乱码或失败，请手动在 MySQL 客户端（如 Navicat, Workbench 或 命令行）中执行以下 SQL。

### 1. 创建数据库 (Ensure UTF-8 Support)

```sql
-- 创建数据库，强制使用 utf8mb4 字符集以支持中文和Emoji
CREATE DATABASE IF NOT EXISTS kailiang_portal
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

### 2. 创建项目表 (Create Table)

```sql
USE kailiang_portal;

-- 如果表已存在，可以选择先删除（慎用，会清空数据）
-- DROP TABLE IF EXISTS projects;

-- 创建表结构
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL COMMENT '项目名称',
  description TEXT COMMENT '项目描述',
  url VARCHAR(2048) NOT NULL COMMENT '项目跳转链接',
  category VARCHAR(100) NOT NULL COMMENT '项目分类',
  image_url LONGTEXT COMMENT '封面图片(Base64或URL)',
  created_at BIGINT NOT NULL COMMENT '创建时间戳'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3. (可选) 插入一条测试数据

```sql
INSERT INTO projects (name, description, url, category, image_url, created_at)
VALUES (
  '测试项目', 
  '这是一个测试数据，用于验证中文显示是否正常。', 
  'https://www.apple.com.cn', 
  '其他应用', 
  '', 
  UNIX_TIMESTAMP() * 1000
);
```