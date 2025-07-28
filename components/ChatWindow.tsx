// components/ChatBot.tsx
"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
// import axios from "axios";

export default function ChatWindow() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);

  const handleSend = async () => {
    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    // const res = await axios.post("/api/chat", { prompt: input });
    const res = await supabase.auth.signUp({ email, password })
    setMessages([...newMessages, { role: "bot", text: res.data.answer }]);
  };

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4">
      <div className="border h-64 overflow-y-auto p-2">
        {messages.map((m, i) => (
          <div key={i} className={`text-${m.role === "user" ? "blue" : "green"}-600`}>
            <strong>{m.role}:</strong> {m.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="border p-2 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
        />
        <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
