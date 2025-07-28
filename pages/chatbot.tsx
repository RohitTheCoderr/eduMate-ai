import {useState, useEffect, useRef } from "react";

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
    // Fetch the user session on mount
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null);
    });
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
      const res = await axios.post("/api/ask", { prompt: input,user_id: userId, });

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

    // <div className="max-w-xl mx-auto  bg-gray-300">
    //   <h1 className="text-2xl text-center bg-orange-200 font-bold py-2">EduMate AI Chat</h1>

    //   {/* Chat messages */}
    //   <div className="min-h-[40rem] max-h-[40rem] overflow-scroll overflow-x-hidden scroll-smooth p-2 bg-scroll-[#000]">
    //     <div className="space-y-3 mb-4">
    //       {messages.map((msg, index) => (
    //         <div
    //           key={index}
    //           className={`flex items-start gap-2 ${
    //             msg.sender === "user" ? "justify-end" : "justify-start"
    //           } animate-fade-in`}
    //         >
    //           {msg.sender === "ai" && <span className="text-2xl">🤖</span>}
    //           <div
    //             className={`p-3 rounded-xl max-w-xs text-sm shadow ${
    //               msg.sender === "user"
    //                 ? "bg-blue-500 text-white rounded-br-none"
    //                 : "bg-gray-200 text-black rounded-bl-none"
    //             }`}
    //           >
    //             <p>{msg.text}</p>
    //             <p className="text-xs mt-1 text-right opacity-70">
    //               {msg.timestamp}
    //             </p>
    //           </div>
    //           {msg.sender === "user" && <span className="text-2xl">👤</span>}
    //         </div>
    //       ))}

    //       {/* Typing loader */}
    //       {isTyping && (
    //         <div className="flex items-center gap-2">
    //           <span className="text-2xl">🤖</span>
    //           <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm animate-pulse">
    //             AI is typing...
    //           </div>
    //         </div>
    //       )}
    //     </div>

    //     {/* Input area */}
    //     <div className="flex justify-between items-center bg-red-400">
    //       <input
    //         className="w-[85%] p-2 border rounded"
    //         placeholder="Ask about resume, project ideas, notes..."
    //         value={input}
    //         onChange={(e) => setInput(e.target.value)}
    //       />
    //       <button
    //         onClick={askAI}
    //         className="bg-blue-600 text-white px-4 py-2 rounded w-auto"
    //       >
    //         Ask AI
    //       </button>

    //       {/* Animations */}
    //       <style jsx>{`
    //         .animate-fade-in {
    //           animation: fadeIn 0.4s ease-in;
    //         }

    //         @keyframes fadeIn {
    //           from {
    //             opacity: 0;
    //             transform: translateY(5px);
    //           }
    //           to {
    //             opacity: 1;
    //             transform: translateY(0);
    //           }
    //         }
    //       `}</style>
    //     </div>
    //   </div>
    // </div>
  );
}

// import { useState } from "react";
// import axios from "axios";

// interface Message {
//   sender: "user" | "ai";
//   text: string;
// }

// export default function EduMateChat() {
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState<Message[]>([]);

//   const askAI = async () => {
//     if (!input.trim()) return;

//     // Add user message
//     setMessages((prev) => [...prev, { sender: "user", text: input }]);

//     try {
//       const res = await axios.post("/api/ask", { prompt: input });

//       // Add AI response
//       setMessages((prev) => [...prev, { sender: "ai", text: res.data.answer }]);
//     } catch (error) {
//       setMessages((prev) => [
//         ...prev,
//         { sender: "ai", text: "Something went wrong. Please try again." },
//       ]);
//     }

//     setInput("");
//   };

//   return (
//     <div className="max-w-xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">EduMate AI Chat</h1>

//       {/* Chat messages */}
//       <div className="space-y-2 mb-4">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`flex ${
//               msg.sender === "user" ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`p-3 rounded-lg max-w-xs ${
//                 msg.sender === "user"
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-200 text-black"
//               }`}
//             >
//               {msg.text}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Input + button */}
//       <div className="flex justify-between items-center bg-red-400">
//         <input
//           className="w-[85%] p-2 border rounded"
//           // rows={3}
//           placeholder="Ask about resume, project ideas, notes..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//         />
//         <button
//           onClick={askAI}
//           className="bg-blue-600 text-white px-4 py-2 rounded w-auto"
//         >
//           Ask AI
//         </button>
//       </div>
//     </div>
//   );
// }

// // "use client";
// // import { useState } from 'react';
// // import axios from 'axios';

// // export default function ChatPage() {
// //   const [input, setInput] = useState('');
// //   const [reply, setReply] = useState('');

// //   // const askAI = async () => {
// //   //   const res = await axios.post('/api/ask', { prompt: input });
// //   //   setReply(res.data.answer);
// //   // };

// //   const askAI = async () => {
// //   try {
// //     console.log("data", input);

// //     const res = await axios.post('/api/ask', { prompt: input });
// //     console.log("res", res);

// //     setReply(res.data.answer);
// //   } catch (err) {
// //     console.error('Error from /api/ask:', err);
// //     setReply('Something went wrong while talking to AI.');
// //   }
// // };

// //   return (
// //     <div className="max-w-xl mx-auto p-4">
// //       <h1 className="text-2xl font-bold mb-4">EduMate AI Chat</h1>
// //       <textarea
// //         className="w-full p-2 border rounded"
// //         rows={4}
// //         placeholder="Ask about resume, project ideas, notes..."
// //         value={input}
// //         onChange={(e) => setInput(e.target.value)}
// //       />
// //       <button
// //         onClick={askAI}
// //         className="bg-blue-600 text-white px-4 py-2 mt-2 rounded"
// //       >
// //         Ask AI
// //       </button>

// //       {reply && (
// //         <div className="mt-4 p-3 bg-gray-100 border rounded">
// //           <strong>AI:</strong> {reply}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
