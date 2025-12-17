import React, { useState, useEffect, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Bot, User as UserIcon, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AIChat: React.FC = () => {
  const { user, tasks, inventory } = useStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `Hello ${user.name}! I'm your FlowForge Assistant. I have access to your tasks and inventory overview. How can I help you optimize your workflow today?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize AI with context awareness
  useEffect(() => {
    const contextSummary = `
      Current Context:
      User: ${user.name} (${user.role})
      Total Tasks: ${tasks.length}
      Pending Tasks: ${tasks.filter(t => t.status !== 'Done').length}
      Inventory Items: ${inventory.length}
      Low Stock Items: ${inventory.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock').map(i => i.name).join(', ')}
    `;
    geminiService.initChat(`You are FlowForge AI. Use the following context to answer specific questions if asked: ${contextSummary}. Be concise, professional, and helpful.`);
  }, [user, tasks, inventory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await geminiService.sendMessage(input);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800">FlowForge Intelligence</h2>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-xs text-slate-500">Online • Gemini 2.5 Flash</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-200' : 'bg-primary-100'}`}>
              {msg.role === 'user' ? <UserIcon className="w-5 h-5 text-slate-600" /> : <Bot className="w-5 h-5 text-primary-600" />}
            </div>
            <div className={`max-w-[75%] rounded-2xl p-4 shadow-sm ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-white border border-slate-100 rounded-tl-none text-slate-800'}`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <span className={`text-[10px] mt-2 block opacity-70 ${msg.role === 'user' ? 'text-primary-100' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start gap-4">
             <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
               <Bot className="w-5 h-5 text-primary-600" />
             </div>
             <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
               <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />
               <span className="text-sm text-slate-500">Thinking...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
         {import.meta.env.VITE_GEMINI_API_KEY ? null : (
            <div className="mb-4 p-3 bg-amber-50 text-amber-800 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4"/>
              <span>Warning: No API Key detected. AI features are disabled.</span>
            </div>
         )}
         <form onSubmit={handleSend} className="flex gap-4">
           <input 
             type="text" 
             value={input}
             onChange={(e) => setInput(e.target.value)}
             placeholder="Ask about tasks, inventory, or generate a report..."
             className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
           />
           <button 
             type="submit" 
             disabled={!input.trim() || isTyping}
             className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-primary-500/20"
           >
             <Send className="w-5 h-5" />
           </button>
         </form>
      </div>
    </div>
  );
};
