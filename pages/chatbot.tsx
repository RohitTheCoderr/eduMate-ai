import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { supabase } from "@/lib/supabaseClient";

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export default function EduMateChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch user and their messages
    const fetchUserAndMessages = async () => {
      // Fetch the user session on mount
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);

        const { data: messagesData, error } = await supabase
          .from("chat_messages")
          .select("message, response, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        if (messagesData) {
          // Transform DB messages into chat format
          const loadedMessages: Message[] = [];
          messagesData.forEach((m: any) => {
            loadedMessages.push({
              sender: "user",
              text: m.message,
              timestamp: new Date(m.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            });
            loadedMessages.push({
              sender: "ai",
              text: m.response,
              timestamp: new Date(m.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            });
          });
          setMessages(loadedMessages);
        }

        if (error) {
          console.error("Error loading messages:", error);
        }
      }
    };
    fetchUserAndMessages();
  }, []);

  const getTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const askAI = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMsg: Message = {
      sender: "user",
      text: input,
      timestamp: getTime(),
    };
    setMessages((prev) => [...prev, userMsg]);

    setIsTyping(true);

    try {
      const res = await axios.post("/api/ask", {
        prompt: input,
        user_id: userId,
      });

      const aiMsg: Message = {
        sender: "ai",
        text: res.data.answer,
        timestamp: getTime(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const aiError: Message = {
        sender: "ai",
        text: "❌ Something went wrong.",
        timestamp: getTime(),
      };
      setMessages((prev) => [...prev, aiError]);
    }

    setInput("");
    setIsTyping(false);
  };


  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-xl mx-auto h-[88vh] flex flex-col bg-gray-100">
      <h1 className="text-2xl text-center bg-orange-200 font-bold py-2">
        EduMate AI Chat
      </h1>

      {/* Chat messages */}
      <div
        className="flex-1 overflow-y-auto p-2 space-y-3 scrollbar-hide"
        id="chatBox"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            } animate-fade-in`}
          >
            {msg.sender === "ai" && <span className="text-2xl">🤖</span>}
            <div
              className={`p-3 py-2 rounded-xl max-w-xs text-sm shadow ${
                msg.sender === "user"
                  ? "bg-blue-400 text-white rounded-br-none"
                  : "bg-gray-200 text-black rounded-bl-none"
              }`}
            >
              <p>{msg.text}</p>
              <p className="text-xs mt-1 text-right opacity-70">
                {msg.timestamp}
              </p>
            </div>
            {msg.sender === "user" && <span className="text-2xl">👤</span>}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm animate-pulse">
              AI is typing...
            </div>
          </div>
        )}

        <div ref={scrollRef}></div>
      </div>

      {/* Input fixed at bottom */}
      <div className="bg-white flex pt-1 border-t items-center justify-between">
        <input
          className="w-[84%] p-2 border rounded"
          placeholder="Ask about resume, project ideas, notes..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={askAI}
          className="bg-blue-600 text-white px-4 py-2 rounded w-auto"
        >
          Ask AI
        </button>
      </div>

      {/* Fade-in animation */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.4s ease-in;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

