import React, { useState, useEffect, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Send, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME: Message = {
  role: "assistant",
  content: "Welcome. I'm your VitaTrack AI Coach — trained on your profile and goals. Ask me anything about workouts, nutrition, recovery, or strategy. How can I elevate your performance today?",
};

const SUGGESTIONS = [
  "What should I eat before a workout?",
  "Create a weekly workout split for my goal",
  "How much protein do I need daily?",
  "Tips to improve my recovery",
];

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (text?: string) => {
    const content = (text || input).trim();
    if (!content || isLoading) return;
    if (!userId) { toast.error("Please log in to use the AI Coach"); return; }

    const userMsg: Message = { role: "user", content };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("fitness-chat", {
        body: { messages: updated, userId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setMessages([...updated, { role: "assistant", content: data.reply }]);
    } catch (err: any) {
      toast.error("Failed to get a response. Please try again.");
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 7rem)' }}>

        <div className="mb-5 flex-shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-px h-5" style={{ background: 'linear-gradient(180deg, #C9A84C, transparent)' }} />
            <span style={{ color: '#9A9080', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>AI Coach</span>
          </div>
          <div className="flex items-center justify-between">
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.5rem,3vw,2rem)', color: '#EDE8DC', fontWeight: 400 }}>
              Fitness Intelligence
            </h1>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)' }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#C9A84C' }} />
              <span style={{ color: '#C9A84C', fontSize: '0.68rem', letterSpacing: '0.1em', fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase' }}>Llama 3.3 · Live</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-5 pr-1 mb-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-end gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                style={msg.role === "assistant"
                  ? { background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }
                  : { background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
                {msg.role === "assistant"
                  ? <Bot className="w-3.5 h-3.5" style={{ color: '#C9A84C' }} />
                  : <User className="w-3.5 h-3.5" style={{ color: '#7A7060' }} />}
              </div>
              <div className={msg.role === "assistant" ? "chat-bubble-ai" : "chat-bubble-user"}>
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-end gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
                <Bot className="w-3.5 h-3.5" style={{ color: '#C9A84C' }} />
              </div>
              <div className="chat-bubble-ai flex items-center gap-1.5">
                <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length === 1 && !isLoading && (
          <div className="flex-shrink-0 mb-4">
            <p style={{ color: '#8A8070', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif", marginBottom: '0.6rem' }}>Suggested</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)}
                  className="px-3 py-1.5 rounded-lg transition-all"
                  style={{ background: '#0D0D0D', border: '1px solid #1C1C1C', color: '#6A6050', fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-shrink-0 flex gap-2 p-1 rounded-xl" style={{ background: '#0D0D0D', border: '1px solid rgba(201,168,76,0.12)' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Ask your fitness coach anything..."
            disabled={isLoading}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#EDE8DC', fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', padding: '0.75rem 1rem' }}
          />
          <button onClick={() => sendMessage()} disabled={isLoading || !input.trim()}
            className="flex items-center justify-center w-10 h-10 rounded-lg m-0.5 flex-shrink-0"
            style={{ background: input.trim() && !isLoading ? 'linear-gradient(135deg, #C9A84C, #E8C97A)' : '#1A1A1A', color: input.trim() && !isLoading ? '#0A0A0A' : '#9A9080', cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed', transition: 'all 0.3s ease' }}>
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </MainLayout>
  );
};

export default Chat;