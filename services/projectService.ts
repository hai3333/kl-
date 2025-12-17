import { Project, AddProjectDTO, ProjectCategory } from '../types';

// 使用相对路径 '/api'。
// 在开发环境，vite.config.js 会将其代理到 localhost:3001。
// 在生产环境，如果 Node.js 托管了静态文件，也是指向同源的 /api。
const API_BASE_URL = '/api';

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("无法连接到后端服务。", error);
      throw error; 
    }
  },

  addProject: async (data: AddProjectDTO): Promise<Project> => {
    let projectImage = data.imageUrl;
    // 如果没有图片，随机给一张
    if (!projectImage) {
      const randomImages = [
         'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
         'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
         'https://images.unsplash.com/photo-1531297461136-82lw9b293122?auto=format&fit=crop&q=80&w=800'
      ];
      projectImage = randomImages[Math.floor(Math.random() * randomImages.length)];
    }

    const payload = {
      ...data,
      imageUrl: projectImage
    };

    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to create project');
    }

    return await response.json();
  },

  deleteProject: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
  }
};