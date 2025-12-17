import React from 'react';
import { Plus, Command } from 'lucide-react';

interface HeaderProps {
  onAddClick: () => void;
  projectCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onAddClick, projectCount }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white shadow-sm">
            <Command size={18} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-bold tracking-tight text-gray-900">锎量科技</h1>
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">内部服务导航</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-gray-500 sm:block">
            {projectCount} 个项目
          </span>
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>添加项目</span>
          </button>
        </div>
      </div>
    </header>
  );
};