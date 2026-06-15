import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, X, ChevronDown, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export default function AIAdvisor() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: "Welcome to Kena Food Complex! Milled under strict lab indices in Arsi Eteya, Ethiopia, our flour represents the apex of baking and traditional sourdough strength.\n\nI am your **Master Miller & Technical Baking AI Advisor**. Ask me anything about teff fermentation curves, sourdough hydration, industrial flour baking calculations, or which Kena Premium flour is optimal for your automated production lines!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setError(null);
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg,
          history: messages.slice(1), // skip initial greeting to save token limits
        }),
      });

      if (!response.ok) {
        throw new Error('Server experienced connection difficulties. Please check configuration.');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [...prev, { role: 'assistant', text: data.text }]);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to generate response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        role: 'assistant',
        text: "History cleared. I am ready for your next baking formula or flour milling inquiry! Let me know what you need."
      }
    ]);
  };

  // Helper to safely split and format raw markdown-like response text (bullet lists, code blocks, headers, bold text)
  const formatAdvisorText = (txt: string) => {
    if (!txt) return null;
    const parts = txt.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      // Check for code blocks
      if (part.startsWith('```') && part.endsWith('```')) {
        const codeLines = part.slice(3, -3).trim().split('\n');
        // Check if there is a language identifier e.g. markdown / table
        const firstLine = codeLines[0];
        const isLang = ['markdown', 'text', 'html', 'json', 'table', 'css', 'ts', 'js'].includes(firstLine.toLowerCase());
        const finalCode = isLang ? codeLines.slice(1).join('\n') : codeLines.join('\n');

        return (
          <pre
            key={index}
            className="bg-stone-900 text-stone-100 p-3.5 my-3 rounded-lg overflow-x-auto text-xs font-mono border border-stone-800 leading-normal"
          >
            <code>{finalCode}</code>
          </pre>
        );
      }

      // Normal text formatting (bold, lists, headers)
      const lines = part.split('\n');
      return lines.map((line, lIdx) => {
        let content = line.trim();

        // Headers: # Header
        if (content.startsWith('#') && !content.includes('# ')) {
          // nested heading
          const hLevel = (content.match(/#/g) || []).length;
          const cleanText = content.replace(/#/g, '').trim();
          if (hLevel === 1) return <h3 key={lIdx} className="text-base font-bold text-stone-900 mt-4 mb-2">{cleanText}</h3>;
          if (hLevel === 2) return <h4 key={lIdx} className="text-sm font-bold text-stone-800 mt-3 mb-1.5">{cleanText}</h4>;
          return <h5 key={lIdx} className="text-xs font-bold text-stone-700 mt-2.5 mb-1">{cleanText}</h5>;
        } else if (content.startsWith('###')) {
          const cleanText = content.replace('###', '').trim();
          return <h4 key={lIdx} className="text-sm font-bold text-stone-900 mt-3 mb-1.5 border-b border-stone-200 pb-1">{cleanText}</h4>;
        } else if (content.startsWith('##')) {
          const cleanText = content.replace('##', '').trim();
          return <h3 key={lIdx} className="text-base font-bold text-stone-900 mt-4 mb-2 border-b border-stone-200 pb-1">{cleanText}</h3>;
        } else if (content.startsWith('# ')) {
          return <h2 key={lIdx} className="text-md font-extrabold text-amber-800 mt-4 mb-2">{content.substring(2)}</h2>;
        }

        // List items: * or -
        const isBullet = content.startsWith('* ') || content.startsWith('- ') || content.startsWith('• ');
        if (isBullet) {
          const cleanText = content.replace(/^(\*|-|•)\s+/, '');
          return (
            <div key={lIdx} className="flex pl-3.5 my-1.5 text-xs text-stone-600 leading-normal items-start">
              <span className="text-amber-500 font-bold mr-2 select-none">•</span>
              <span>{renderBoldSpans(cleanText)}</span>
            </div>
          );
        }

        // Empty lines
        if (content === '') {
          return <div key={lIdx} className="h-2.5" />;
        }

        // Default paragraph
        return (
          <p key={lIdx} className="text-xs text-stone-600 leading-relaxed mb-2.5">
            {renderBoldSpans(content)}
          </p>
        );
      });
    });
  };

  // Helper to render bold strings using standard asterisks **bold**
  const renderBoldSpans = (text: string) => {
    const boldRegex = /\*\*([\s\S]*?)\*\*/g;
    const pieces = text.split(boldRegex);
    if (pieces.length === 1) return text;

    return pieces.map((piece, i) => {
      // Odd indices represent content inside asterisks
      if (i % 2 === 1) {
        return <strong key={i} className="font-bold text-stone-900">{piece}</strong>;
      }
      return piece;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 float-right hover:scale-[1.02] active:scale-[0.98] transition-all" id="ai-advisor-module">
      {/* Trigger floating block */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white px-4 py-3.5 rounded-full shadow-2xl relative cursor-pointer outline-none border border-amber-600/30 font-semibold"
        aria-label="Toggle Milling Assistant"
      >
        <Sparkles className="w-5 h-5 text-amber-100 animate-pulse" />
        <span className="text-xs tracking-wider uppercase pr-1">Baking / Milling AI Advisor</span>
        {messages.length > 1 && !isOpen && (
          <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] w-5 h-5 flex items-center justify-center font-bold tracking-tighter rounded-full border border-white">
            {messages.length - 1}
          </span>
        )}
      </button>

      {/* Slide-Up Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="absolute bottom-16 right-0 w-[calc(100vw-2.5rem)] sm:w-[420px] h-[550px] bg-white rounded-2xl shadow-3xl border border-stone-200 overflow-hidden flex flex-col z-50 cursor-default"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-800 to-stone-900 p-4 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <div>
                  <h4 className="text-xs font-bold tracking-wider uppercase">Kena Food Advisor</h4>
                  <span className="text-[9px] text-amber-100 flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-ping"></span>
                    Gemini flour intelligence active
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearHistory}
                  className="p-1 px-1.5 text-stone-300 hover:text-white rounded hover:bg-white/10 transition-colors text-[10px] uppercase font-mono flex items-center gap-1 focus:outline-none"
                  title="Clear chat records"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-all focus:outline-none"
                  aria-label="Close Assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-stone-50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-amber-700 text-white rounded-tr-none'
                        : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none'
                    }`}
                  >
                    {/* Render Chat Header */}
                    <span className="text-[9px] tracking-wider font-bold opacity-60 block uppercase mb-1">
                      {msg.role === 'user' ? 'Bakery Partner' : 'Kena Food Master Advisor'}
                    </span>
                    {msg.role === 'user' ? (
                      <p className="text-xs font-medium whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <div className="space-y-0.5">{formatAdvisorText(msg.text)}</div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-none p-3.5 max-w-[85%] shadow-xs flex flex-col space-y-1.5">
                    <span className="text-[9px] tracking-wider font-bold text-stone-400 uppercase">
                      Advisor is typing...
                    </span>
                    <div className="flex items-center justify-center gap-1.5 py-1.5 px-3">
                      <span className="w-2 h-2 bg-amber-600 rounded-full animate-bounce animation-delay-100" />
                      <span className="w-2 h-2 bg-amber-600 rounded-full animate-bounce animation-delay-200" />
                      <span className="w-2 h-2 bg-amber-600 rounded-full animate-bounce animation-delay-300" />
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-xs font-semibold leading-normal">
                  <p>{error}</p>
                  <button
                    onClick={() => { setError(null); setLoading(false); }}
                    className="underline text-[10px] mt-1.5 select-none hover:text-red-950 block text-right font-medium"
                  >
                    Clear error log
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* User Input Form */}
            <form onSubmit={handleSend} className="bg-white p-3 border-t border-stone-200 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about protein counts, baking percentages..."
                disabled={loading}
                className="flex-1 px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none placeholder-stone-400 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-amber-700 text-white p-2.5 rounded-xl hover:bg-amber-800 active:bg-amber-900 transition-colors disabled:opacity-50 flex items-center justify-center shrink-0 cursor-pointer"
                id="send-ai-prompt"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
