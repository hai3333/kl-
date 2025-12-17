export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  category: ProjectCategory;
  imageUrl?: string;
  createdAt: number;
}

export enum ProjectCategory {
  PRODUCTION = '生产管理',
  IOT = 'IoT监控',
  RD = '研发中心',
  ADMIN = '行政人事',
  DATA = '数据分析',
  OTHER = '其他应用'
}

export interface AddProjectDTO {
  name: string;
  description: string;
  url: string;
  category: ProjectCategory;
  imageUrl?: string;
}