import React from 'react';
import { ExternalLink, Trash2 } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800', // 芯片/电路
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800', // 网络安全/数据
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800', // 工业4.0/自动化
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800', // 地球/全球化
  'https://images.unsplash.com/photo-1535378437327-b71280684f00?auto=format&fit=crop&q=80&w=800'  // 智慧城市/全息
];

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  // Generate a consistent random image based on project ID
  const getRandomImage = (id: string) => {
    const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];
  };

  const displayImage = project.imageUrl || getRandomImage(project.id);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('确定要删除这个项目快捷方式吗？')) {
      onDelete(project.id);
    }
  };

  return (
    <a 
      href={project.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 ease-out"
    >
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img 
          src={displayImage} 
          alt={project.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 rounded-md bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm">
          {project.category}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between p-5 bg-white">
        <div>
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              {project.name}
            </h3>
            <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>
        
        <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-50 opacity-80 group-hover:opacity-100 transition-opacity">
           <span className="text-xs font-medium text-blue-600 group-hover:underline">
            打开应用 →
          </span>
          
          <button 
            onClick={handleDelete}
            className="z-10 rounded-full p-2 text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
            title="删除项目"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </a>
  );
};