import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { Send, Bot, User, Sparkles, Brain, Plus, PenTool, X } from 'lucide-react';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (text: string, image?: string) => void;
  isLoading: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingText, setLoadingText] = useState('Thinking...');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, selectedImage]);

  useEffect(() => {
    if (!isLoading) return;
    const texts = [
      "Analyzing request...", "Designing structure...", "Writing code...", "Refining styles...", "Finalizing..."
    ];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % texts.length;
      setLoadingText(texts[index]);
    }, 2000);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode && inputRef.current) inputRef.current.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || selectedImage) && !isLoading) {
      onSendMessage(input.trim(), selectedImage || undefined);
      setInput('');
      setSelectedImage(null);
      setIsEditMode(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="p-3 border-b border-gray-800 flex justify-between items-center bg-gray-900">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-gray-200">DevGenie AI</span>
        </div>
        <button 
          onClick={toggleEditMode}
          className={`p-1.5 rounded-md transition-colors ${isEditMode ? 'bg-blue-900/50 text-blue-400' : 'hover:bg-gray-800 text-gray-500'}`}
          title="Edit Mode"
        >
          <PenTool size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4 mt-8">
            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-2">
               <Bot className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-xs max-w-[200px] leading-relaxed">
              I can build pages, components, or fix bugs. Describe what you need.
            </p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`flex gap-2 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
              </div>
              <div className="flex flex-col gap-2">
                {msg.image && (
                  <img src={msg.image} alt="Attachment" className="max-w-[150px] rounded-lg border border-gray-700" />
                )}
                <div className={`p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200'}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-2 items-center">
             <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center animate-pulse">
               <Brain size={12} />
             </div>
             <span className="text-xs text-purple-400 animate-pulse">{loadingText}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-800 bg-gray-900">
        {selectedImage && (
          <div className="mb-2 relative inline-block">
            <img src={selectedImage} alt="Selected" className="h-16 rounded border border-gray-700" />
            <button onClick={() => setSelectedImage(null)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5">
              <X size={10} />
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={`flex gap-2 p-2 rounded-lg border transition-all ${isEditMode ? 'border-blue-500/50 bg-blue-900/10' : 'border-gray-700 bg-gray-950'}`}>
          <input type="file" ref={fileInputRef} onChange={handleImageSelect} className="hidden" accept="image/*" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="text-gray-400 hover:text-gray-200">
            <Plus size={18} />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isEditMode ? "Describe changes..." : "Type a message..."}
            className="flex-1 bg-transparent border-none text-sm text-white focus:outline-none placeholder-gray-600"
            disabled={isLoading}
          />
          <button type="submit" disabled={!input.trim() && !selectedImage} className="text-blue-400 hover:text-blue-300 disabled:opacity-50">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};