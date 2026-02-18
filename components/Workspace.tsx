import React, { useState } from 'react';
import { generateWebsite } from '../services/geminiService';
import { Message, GeneratedCode, ViewMode, Project } from '../types';
import { ChatPanel } from './ChatPanel';
import { PreviewPanel } from './PreviewPanel';
import { CodeViewer } from './CodeViewer';
import { 
  Code, Eye, Laptop, Smartphone, Tablet, Terminal, 
  Download, ChevronLeft, Layers, Image as ImageIcon, 
  Database, Settings, Play, Save, Share2, Box, FileCode
} from 'lucide-react';
import JSZip from 'jszip';

interface WorkspaceProps {
  project?: Project;
  onBack: () => void;
}

const DEVICES = {
  mobile: 'max-w-[375px]',
  tablet: 'max-w-[768px]',
  desktop: 'w-full'
};

export const Workspace: React.FC<WorkspaceProps> = ({ project, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentCode, setCurrentCode] = useState<GeneratedCode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [rightPanelTab, setRightPanelTab] = useState<'chat' | 'code'>('chat');
  const [deviceWidth, setDeviceWidth] = useState<string>(DEVICES.desktop);
  const [activeDevice, setActiveDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  const handleSendMessage = async (text: string, image?: string) => {
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      image: image,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const response = await generateWebsite(text, [...messages, newUserMsg], image);
      
      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response.text,
        code: response.code || undefined,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, newAiMsg]);
      if (response.code) {
        setCurrentCode(response.code);
        // Automatically switch to code view in right panel if code is generated
        // setRightPanelTab('code'); 
      }
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeviceChange = (device: 'mobile' | 'tablet' | 'desktop') => {
    setActiveDevice(device);
    setDeviceWidth(DEVICES[device]);
  };

  const handleExport = async () => {
    if (!currentCode) return;
    try {
      const zip = new JSZip();
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project?.name || 'DevGenie Project'}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>${currentCode.css}</style>
</head>
<body>
    ${currentCode.html}
    <script>${currentCode.javascript}</script>
</body>
</html>`;
      zip.file("index.html", htmlContent);
      const content = await zip.generateAsync({type:"blob"});
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project?.name || 'project'}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const handleDatabaseIntegration = () => {
    setRightPanelTab('chat');
    handleSendMessage("Please integrate a Supabase backend for this project. Set up the client and create a schema for storing data.");
  };

  return (
    <div className="h-screen w-full bg-gray-950 flex flex-col text-gray-100 font-sans overflow-hidden">
      
      {/* Top Navigation Bar */}
      <header className="h-14 border-b border-gray-800 bg-gray-900/80 backdrop-blur-md flex items-center justify-between px-4 flex-shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="flex flex-col">
            <h1 className="font-semibold text-sm text-gray-200">{project?.name || 'Untitled Project'}</h1>
            <span className="text-xs text-gray-500">Last saved just now</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-800/50 p-1 rounded-lg border border-gray-700/50">
           <button 
             onClick={() => handleDeviceChange('desktop')}
             className={`p-1.5 rounded-md ${activeDevice === 'desktop' ? 'bg-gray-700 text-blue-400' : 'text-gray-400 hover:text-white'}`}
           >
             <Laptop size={16} />
           </button>
           <button 
             onClick={() => handleDeviceChange('tablet')}
             className={`p-1.5 rounded-md ${activeDevice === 'tablet' ? 'bg-gray-700 text-blue-400' : 'text-gray-400 hover:text-white'}`}
           >
             <Tablet size={16} />
           </button>
           <button 
             onClick={() => handleDeviceChange('mobile')}
             className={`p-1.5 rounded-md ${activeDevice === 'mobile' ? 'bg-gray-700 text-blue-400' : 'text-gray-400 hover:text-white'}`}
           >
             <Smartphone size={16} />
           </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-md text-xs font-medium border border-gray-700 transition-colors">
            <Save size={14} />
            Save
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-md text-xs font-medium border border-gray-700 transition-colors">
            <Download size={14} />
            Export
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-md text-xs font-medium text-white shadow-lg shadow-blue-900/20 transition-all">
            <Share2 size={14} />
            Deploy
          </button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar (Tools) */}
        <div className="w-16 border-r border-gray-800 bg-gray-900 flex flex-col items-center py-4 gap-4 z-10">
          <SidebarIcon icon={<Layers size={20} />} label="Pages" active />
          <SidebarIcon icon={<Box size={20} />} label="Components" />
          <SidebarIcon icon={<ImageIcon size={20} />} label="Assets" />
          <SidebarIcon icon={<Database size={20} />} label="Database" onClick={handleDatabaseIntegration} />
          <div className="flex-1" />
          <SidebarIcon icon={<Settings size={20} />} label="Settings" />
        </div>

        {/* Center Canvas (Preview) */}
        <div className="flex-1 bg-gray-950 relative flex flex-col">
           <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>
           <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
              <div className={`transition-all duration-300 shadow-2xl ${deviceWidth} h-full bg-white ${activeDevice !== 'desktop' ? 'rounded-[2rem] border-[8px] border-gray-800' : 'rounded-lg'}`}>
                <PreviewPanel code={currentCode} isLoading={isLoading} />
              </div>
           </div>
        </div>

        {/* Right Panel (AI & Code) */}
        <div className="w-[400px] border-l border-gray-800 bg-gray-900 flex flex-col shadow-xl z-10">
          {/* Tabs */}
          <div className="flex border-b border-gray-800">
            <button 
              onClick={() => setRightPanelTab('chat')}
              className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${rightPanelTab === 'chat' ? 'text-blue-400 border-b-2 border-blue-500 bg-gray-800/50' : 'text-gray-400 hover:bg-gray-800/50'}`}
            >
              <Terminal size={16} />
              AI Assistant
            </button>
            <button 
              onClick={() => setRightPanelTab('code')}
              className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${rightPanelTab === 'code' ? 'text-blue-400 border-b-2 border-blue-500 bg-gray-800/50' : 'text-gray-400 hover:bg-gray-800/50'}`}
            >
              <FileCode size={16} />
              Code Editor
            </button>
          </div>

          <div className="flex-1 overflow-hidden relative">
            {rightPanelTab === 'chat' ? (
              <ChatPanel messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} />
            ) : (
              <CodeViewer code={currentCode} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

const SidebarIcon: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group relative ${active ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
  >
    {icon}
    <div className="absolute left-14 bg-gray-800 text-xs px-2 py-1 rounded border border-gray-700 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
      {label}
    </div>
  </button>
);
