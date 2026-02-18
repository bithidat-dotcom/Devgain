import React from 'react';
import { Plus, Layout, ShoppingBag, Briefcase, FileText, Clock, ArrowRight, Settings, CreditCard, Box, Zap } from 'lucide-react';
import { Project } from '../types';

interface DashboardProps {
  onOpenProject: (project?: Project) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenProject }) => {
  const recentProjects: Project[] = [
    { id: '1', name: 'Personal Portfolio', type: 'portfolio', lastModified: Date.now() - 10000000 },
    { id: '2', name: 'Startup Landing', type: 'website', lastModified: Date.now() - 86400000 },
    { id: '3', name: 'E-commerce Store', type: 'ecommerce', lastModified: Date.now() - 172800000 },
  ];

  const templates = [
    { icon: <Briefcase className="text-blue-400" />, name: 'Portfolio', desc: 'Showcase your work' },
    { icon: <ShoppingBag className="text-pink-400" />, name: 'E-commerce', desc: 'Sell products online' },
    { icon: <Layout className="text-purple-400" />, name: 'Landing Page', desc: 'Convert visitors' },
    { icon: <FileText className="text-green-400" />, name: 'Blog', desc: 'Share your thoughts' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-2">
              Welcome back, Creator
            </h1>
            <p className="text-gray-400">What would you like to build today?</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-gray-900 px-4 py-2 rounded-lg border border-gray-800 flex items-center gap-2">
                <Box size={16} className="text-blue-500"/>
                <span className="text-sm font-medium">Free Plan</span>
             </div>
             <button className="p-2 bg-gray-900 rounded-lg border border-gray-800 hover:bg-gray-800">
                <Settings size={20} className="text-gray-400" />
             </button>
          </div>
        </div>

        {/* AI Quick Start */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-white/10 rounded-2xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center gap-2 text-blue-400 font-medium">
                <Zap size={18} className="fill-blue-400/20" />
                <span>AI Quick Generate</span>
              </div>
              <h2 className="text-3xl font-bold">Describe it. Build it. Done.</h2>
              <p className="text-gray-400 text-lg">
                Start a new project simply by telling our Gemini 3 Pro AI what you want. We'll generate the structure, design, and code instantly.
              </p>
              <button 
                onClick={() => onOpenProject()}
                className="bg-white text-gray-950 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-transform active:scale-95 flex items-center gap-2"
              >
                <Plus size={20} />
                Create New Project
              </button>
            </div>
            
            {/* Visual Decoration */}
            <div className="hidden md:grid grid-cols-2 gap-3 opacity-50 group-hover:opacity-80 transition-opacity">
                <div className="w-32 h-20 bg-gray-800/50 rounded-lg border border-gray-700/50"></div>
                <div className="w-32 h-20 bg-gray-800/50 rounded-lg border border-gray-700/50 translate-y-4"></div>
                <div className="w-32 h-20 bg-gray-800/50 rounded-lg border border-gray-700/50 -translate-y-2"></div>
                <div className="w-32 h-20 bg-gray-800/50 rounded-lg border border-gray-700/50 translate-y-2"></div>
            </div>
          </div>
        </div>

        {/* Templates */}
        <div>
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Layout size={20} className="text-gray-500" />
            Start with a Template
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.map((t, i) => (
              <button 
                key={i}
                onClick={() => onOpenProject()}
                className="group flex flex-col items-start p-6 bg-gray-900/50 border border-gray-800 hover:border-blue-500/50 hover:bg-gray-900 rounded-xl transition-all text-left"
              >
                <div className="mb-4 p-3 bg-gray-800/50 rounded-lg group-hover:scale-110 transition-transform">
                  {t.icon}
                </div>
                <span className="font-semibold text-lg block mb-1">{t.name}</span>
                <span className="text-sm text-gray-500">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div>
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Clock size={20} className="text-gray-500" />
            Recent Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentProjects.map((project) => (
              <div 
                key={project.id}
                onClick={() => onOpenProject(project)}
                className="cursor-pointer group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-blue-900/10 transition-all hover:-translate-y-1"
              >
                <div className="h-40 bg-gray-800 relative overflow-hidden">
                   {/* Thumbnail Placeholder */}
                   <div className="absolute inset-0 flex items-center justify-center text-gray-700">
                      <Layout size={48} />
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-lg group-hover:text-blue-400 transition-colors">{project.name}</h4>
                    <span className="text-xs px-2 py-1 bg-gray-800 rounded-full text-gray-400 capitalize">{project.type}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
                    <span>Edited {new Date(project.lastModified).toLocaleDateString()}</span>
                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};