export interface GeneratedCode {
  html: string;
  css: string;
  javascript: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  image?: string; // Base64 data URL
  code?: GeneratedCode;
  timestamp: number;
}

export type ViewMode = 'preview' | 'code';

export interface Project {
  id: string;
  name: string;
  thumbnail?: string;
  lastModified: number;
  type: 'website' | 'ecommerce' | 'blog' | 'portfolio';
}

export type AppView = 'dashboard' | 'workspace';
