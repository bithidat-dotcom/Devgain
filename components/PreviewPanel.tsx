import React, { useEffect, useRef } from 'react';
import { GeneratedCode } from '../types';
import { Loader2 } from 'lucide-react';

interface PreviewPanelProps {
  code: GeneratedCode | null;
  isLoading: boolean;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ code, isLoading }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (code && iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                /* Base Reset */
                body { margin: 0; padding: 0; }
                /* Custom CSS */
                ${code.css}
              </style>
            </head>
            <body>
              ${code.html}
              <script>
                // Error catching for the iframe
                window.onerror = function(message, source, lineno, colno, error) {
                  console.error('Preview Error:', message);
                };
                
                try {
                  ${code.javascript}
                } catch (e) {
                  console.error('Runtime Script Error:', e);
                }
              </script>
            </body>
          </html>
        `);
        doc.close();
      }
    }
  }, [code]);

  if (!code && !isLoading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-gray-500 bg-gray-900/50 backdrop-blur-sm border-2 border-dashed border-gray-700 rounded-xl m-4">
        <div className="w-16 h-16 mb-4 rounded-xl bg-gray-800 flex items-center justify-center">
          <span className="text-4xl">✨</span>
        </div>
        <p className="text-lg">Ready to build something amazing.</p>
        <p className="text-sm opacity-60">Describe your idea in the chat.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-white rounded-xl overflow-hidden shadow-2xl">
      {isLoading && (
         <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center">
             <div className="bg-gray-900 text-blue-400 px-6 py-4 rounded-xl shadow-2xl flex flex-col items-center gap-3 border border-gray-800">
               <Loader2 className="w-8 h-8 animate-spin" />
               <span className="text-sm font-medium text-gray-200">Generating code...</span>
             </div>
         </div>
      )}
      {code && (
        <iframe
          ref={iframeRef}
          title="Preview"
          className="w-full h-full border-none bg-white"
          sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-popups"
        />
      )}
    </div>
  );
};