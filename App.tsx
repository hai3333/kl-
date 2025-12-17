import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ProjectCard } from './components/ProjectCard';
import { GlassModal } from './components/ui/GlassModal';
import { projectService } from './services/projectService';
import { Project, ProjectCategory, AddProjectDTO } from './types';
import { Search, Layers, Loader2, Upload, Image as ImageIcon } from 'lucide-react';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  
  // Form State
  const [formData, setFormData] = useState<AddProjectDTO>({
    name: '',
    description: '',
    url: '',
    category: ProjectCategory.OTHER,
    imageUrl: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("图片大小不能超过 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.url) return;
    
    setSubmitting(true);
    try {
      const newProject = await projectService.addProject(formData);
      setProjects(prev => [newProject, ...prev]);
      setIsModalOpen(false);
      setFormData({
        name: '',
        description: '',
        url: '',
        category: ProjectCategory.OTHER,
        imageUrl: ''
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    await projectService.deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['全部', ...Object.values(ProjectCategory)];

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-gray-900 pb-20">
      <Header onAddClick={() => setIsModalOpen(true)} projectCount={projects.length} />

      <main className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="py-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-3">
            智造未来，高效协同
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-500">
            锎量宁夏自动化科技有限公司 · 内部服务导航
          </p>
        </div>

        {/* Filters */}
        <div className="sticky top-16 z-30 mb-8 -mx-6 bg-[#F5F5F7]/95 backdrop-blur-sm px-6 py-3 md:static md:mx-0 md:bg-transparent md:p-0 md:backdrop-blur-none border-b border-gray-200 md:border-0">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`
                    whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors
                    ${selectedCategory === cat 
                      ? 'bg-gray-800 text-white shadow-sm' 
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="搜索项目..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-lg border-0 bg-white py-2 pl-10 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="animate-spin text-gray-400" size={32} />
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl bg-white border border-dashed border-gray-300">
            <div className="rounded-full bg-gray-50 p-4 mb-4">
              <Layers className="text-gray-400" size={32} />
            </div>
            <h3 className="text-base font-semibold text-gray-900">未找到项目</h3>
            <p className="text-sm text-gray-500">请调整搜索关键词或添加新项目。</p>
          </div>
        )}
      </main>

      {/* Add Project Modal */}
      <GlassModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="添加新项目"
      >
        <form onSubmit={handleAddProject} className="space-y-4">
          
          {/* Image Upload */}
          <div>
             <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
              项目封面
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 py-6 hover:bg-gray-100 transition-colors"
            >
              {formData.imageUrl ? (
                <div className="relative h-32 w-full overflow-hidden rounded-md px-6">
                  <img src={formData.imageUrl} alt="Preview" className="h-full w-full object-cover rounded-md" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium">更换图片</span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                  <div className="mt-2 flex text-sm leading-6 text-gray-600 justify-center">
                    <span className="font-semibold text-blue-600 hover:text-blue-500">点击上传</span>
                    <span className="pl-1">或拖拽图片</span>
                  </div>
                  <p className="text-xs text-gray-500">支持 PNG, JPG, GIF (最大 2MB)</p>
                </div>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
              项目名称
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="block w-full rounded-lg border-0 bg-white py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="例如：EMS 能源管理系统"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
              项目分类
            </label>
            <div className="mt-1">
              <select
                id="category"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as ProjectCategory})}
                className="block w-full rounded-lg border-0 bg-white py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              >
                {Object.values(ProjectCategory).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium leading-6 text-gray-900">
              跳转链接 (URL)
            </label>
            <div className="mt-1">
              <input
                type="url"
                id="url"
                required
                value={formData.url}
                onChange={e => setFormData({...formData, url: e.target.value})}
                className="block w-full rounded-lg border-0 bg-white py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
              项目描述
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="block w-full rounded-lg border-0 bg-white py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="简要描述该系统的功能..."
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? '提交中...' : '确认添加'}
            </button>
          </div>
        </form>
      </GlassModal>
    </div>
  );
};

export default App;