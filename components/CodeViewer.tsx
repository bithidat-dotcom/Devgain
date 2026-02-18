import React, { useEffect } from 'react';
import { GeneratedCode } from '../types';
import Prism from 'prismjs';

interface CodeViewerProps {
  code: GeneratedCode | null;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ code }) => {
  useEffect(() => {
    if (code) {
      Prism.highlightAll();
    }
  }, [code]);

  if (!code) return (
    <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8 text-center">
      <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </div>
      <p className="text-sm font-medium text-gray-400">No code generated yet.</p>
      <p className="text-xs mt-2 text-gray-600">Start a chat to build something.</p>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto bg-[#2d2d2d] p-0 font-mono text-xs scrollbar-thin scrollbar-thumb-gray-700">
      <div className="border-b border-gray-700">
        <div className="bg-[#1e1e1e] px-4 py-2 flex justify-between items-center sticky top-0 z-10 border-b border-gray-800">
          <span className="font-bold text-blue-400 uppercase tracking-wider text-[10px]">index.html</span>
          <span className="text-gray-500 text-[10px]">{code.html.length} chars</span>
        </div>
        <pre className="!m-0 !p-4 !bg-transparent language-html">
          <code className="language-html">{code.html}</code>
        </pre>
      </div>
      
      {code.css && (
        <div className="border-b border-gray-700">
          <div className="bg-[#1e1e1e] px-4 py-2 flex justify-between items-center sticky top-0 z-10 border-b border-gray-800">
            <span className="font-bold text-pink-400 uppercase tracking-wider text-[10px]">style.css</span>
            <span className="text-gray-500 text-[10px]">{code.css.length} chars</span>
          </div>
          <pre className="!m-0 !p-4 !bg-transparent language-css">
            <code className="language-css">{code.css}</code>
          </pre>
        </div>
      )}

      {code.javascript && (
        <div>
          <div className="bg-[#1e1e1e] px-4 py-2 flex justify-between items-center sticky top-0 z-10 border-b border-gray-800">
            <span className="font-bold text-yellow-400 uppercase tracking-wider text-[10px]">script.js</span>
            <span className="text-gray-500 text-[10px]">{code.javascript.length} chars</span>
          </div>
          <pre className="!m-0 !p-4 !bg-transparent language-javascript">
            <code className="language-javascript">{code.javascript}</code>
          </pre>
        </div>
      )}
    </div>
  );
};