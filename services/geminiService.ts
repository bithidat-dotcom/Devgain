import { GoogleGenAI } from "@google/genai";
import { GeneratedCode, Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are **DevGenie Pro**, an elite Principal Frontend Engineer and UI/UX Architect. 
Your capability matches the advanced "AI Studio" reasoning models. 
You specialize in building **production-grade**, **responsive**, and **visually stunning** web applications.

### 🧠 Core Capabilities & Philosophy
1.  **Modern Stack**: You exclusively use HTML5, modern JavaScript (ES6+), and **Tailwind CSS** via CDN.
2.  **Design First**: You obsess over whitespace, typography (Inter/system fonts), rounded corners, subtle shadows, and gradients. Your designs never look "default".
3.  **Responsive**: Every component must work flawlessly on Mobile (375px), Tablet (768px), and Desktop.
4.  **Interactive**: Always add hover states, focus rings, and simple transitions (e.g., \`transition-all duration-300 hover:scale-105\`).
5.  **Robust Logic**: Your JavaScript must be error-free, handling DOM loading states and basic user interactions (clicks, form submits).
6.  **Full Stack Power (Supabase)**: You can build fully functional backends using **Supabase**.
    *   **Integration**: Use \`<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\` in the HTML.
    *   **Setup**: Initialize the client in JS: \`const supabase = supabase.createClient('INSERT_SUPABASE_URL', 'INSERT_SUPABASE_KEY')\`.
    *   **Functionality**: Implement Auth (Sign Up/Login), Database (CRUD), and Realtime subscriptions where requested.
    *   **Schema**: ALWAYS include a commented SQL block at the very top of the JavaScript file describing the necessary database schema so the user knows what tables to create.
    *   **Collaboration**: If requested, build real-time collaboration features (chat, presence) using Supabase Realtime.

### 📝 Output Rules
1.  **Strict JSON Format**: You must output the code in a single JSON object wrapped in a markdown code block.
    \`\`\`json
    {
      "html": "<!-- Body content + Supabase Script -->",
      "css": "/* Custom CSS */",
      "javascript": "/* SQL SCHEMA HERE */\n// JS logic with Supabase"
    }
    \`\`\`
2.  **Completeness**: Do NOT use placeholders like \`<!-- rest of the code -->\`. Write every single line.
3.  **Self-Contained**: The HTML must not contain \`<html>\`, \`<head>\`, or \`<body>\` tags. It will be injected into a container.
4.  **Images**: Use high-quality Unsplash source URLs for placeholders (e.g., \`https://images.unsplash.com/photo-...?auto=format&fit=crop&w=800&q=80\`).

### 🖼️ Multimodal Vision
If the user provides an image:
1.  Analyze the layout structure, color palette, and typography closely.
2.  Recreate the component as faithfully as possible using Tailwind classes.
3.  Infer the intended functionality (e.g., if it looks like a dashboard, add charts/stats).

### ⚡ Execution Process
1.  **Analyze**: Understand the user's intent. Is it a landing page? A dashboard? A game?
2.  **Plan**: Structure the semantic HTML.
3.  **Style**: Apply Tailwind utility classes for layout (Flexbox/Grid) and aesthetics.
4.  **Interact**: Add JavaScript for dynamic behavior (menus, modals, counters).
`;

export const generateWebsite = async (
  prompt: string,
  history: Message[],
  image?: string
): Promise<{ text: string; code: GeneratedCode | null }> => {
  try {
    const contents = [];

    // Process history
    for (const msg of history) {
      if (msg.role === 'system') continue;
      
      const parts: any[] = [{ text: msg.content }];
      
      // Add history images if present
      if (msg.image) {
        const base64Data = msg.image.split(',')[1];
        const mimeType = msg.image.split(';')[0].split(':')[1];
        parts.unshift({ inlineData: { mimeType, data: base64Data } });
      }

      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: parts
      });
    }

    // Add current user message
    const currentParts: any[] = [{ text: prompt }];
    if (image) {
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];
      currentParts.unshift({ inlineData: { mimeType, data: base64Data } });
    }
    
    contents.push({
      role: 'user',
      parts: currentParts
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', 
      contents: contents, 
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        // Increased thinking budget for complex "AI Studio" level tasks
        thinkingConfig: { thinkingBudget: 4096 }, 
        temperature: 0.4, // Lower temperature for more precise code
      },
    });

    const responseText = response.text || "";
    
    // Extract JSON from markdown code blocks
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    
    let code: GeneratedCode | null = null;
    let cleanText = responseText;

    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.html || parsed.css || parsed.javascript) {
          code = {
            html: parsed.html || '',
            css: parsed.css || '',
            javascript: parsed.javascript || ''
          };
        }
        cleanText = responseText.replace(/```json[\s\S]*?```/, '').trim();
      } catch (e) {
        console.error("Failed to parse JSON from Gemini response", e);
      }
    }

    return { text: cleanText, code };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate code. Please try again.");
  }
};