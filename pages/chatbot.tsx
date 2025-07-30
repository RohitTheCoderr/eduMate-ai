import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/router";

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export default function EduMateChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
   const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

//  for get auth for login or not
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    getSession();

    // Optional: Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
              timestamp: new Date(m.created_at).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: "Asia/Kolkata", // Force IST
              }),
            });
            loadedMessages.push({
              sender: "ai",
              text: m.response,
              timestamp: new Date(m.created_at).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: "Asia/Kolkata", // Force IST
              }),
              // timestamp: new Date(m.created_at).toLocaleTimeString([], {
              //   hour: "2-digit",
              //   minute: "2-digit",
              // }),
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

  // const getTime = () =>
  //   new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const getTime = () =>
    new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata", // Force IST
    });

  const askAI = async () => {
    // when user not login
    if (!isLoggedIn) {
      alert("please login First!")
      return router.push("/login");
    }

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
    // <div className="max-w-xl mx-auto h-[88vh] flex flex-col bg-gray-100">
    //   <h1 className="text-2xl text-center bg-orange-200 font-bold py-2">
    //     EduMate AI Chat
    //   </h1>

    //   {/* Chat messages */}
    //   <div
    //     className="flex-1 overflow-y-auto p-2 space-y-3 scrollbar-hide"
    //     id="chatBox"
    //   >
    //     {messages.map((msg, index) => (
    //       <div
    //         key={index}
    //         className={`flex items-start gap-2 ${
    //           msg.sender === "user" ? "justify-end" : "justify-start"
    //         } animate-fade-in`}
    //       >
    //         {msg.sender === "ai" && <span className="text-2xl">🤖</span>}
    //         <div
    //           className={`p-3 py-2 rounded-xl max-w-xs text-sm shadow ${
    //             msg.sender === "user"
    //               ? "bg-blue-400 text-white rounded-br-none"
    //               : "bg-gray-200 text-black rounded-bl-none"
    //           }`}
    //         >
    //           <p>{msg.text}</p>
    //           <p className="text-xs mt-1 text-right opacity-70">
    //             {msg.timestamp}
    //           </p>
    //         </div>
    //         {msg.sender === "user" && <span className="text-2xl">👤</span>}
    //       </div>
    //     ))}

    //     {isTyping && (
    //       <div className="flex items-center gap-2">
    //         <span className="text-2xl">🤖</span>
    //         <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm animate-pulse">
    //           AI is typing...
    //         </div>
    //       </div>
    //     )}

    //     <div ref={scrollRef}></div>
    //   </div>

    //   {/* Input fixed at bottom */}
    //   {/* <div className="bg-white border border-gray-300 flex pt-1 border-t items-center justify-between">
    //     <textarea
    //       className="w-[80%] sm:w-[84%] p-2 border rounded"
    //       placeholder="Ask about resume, project ideas, notes..."
    //       rows={1}
    //       value={input}
    //       onChange={(e) => setInput(e.target.value)}
    //     />
    //     <button
    //       onClick={askAI}
    //       className="bg-blue-600 text-white px-4 py-2 rounded w-auto"
    //     >
    //       Ask AI
    //     </button>
    //   </div> */}
    //   <div className="bg-white border border-gray-300 flex pt-1 border-t items-center gap-2 p-2">
    //     <textarea
    //       className="flex-grow p-2 border rounded resize-none overflow-y-auto"
    //       placeholder="Ask about resume, project ideas, notes..."
    //       rows={1}
    //       value={input}
    //       onChange={(e) => setInput(e.target.value)}
    //     />
    //     <button
    //       onClick={askAI}
    //       className="bg-blue-600 text-white px-4 py-2 rounded shrink-0"
    //     >
    //       Ask AI
    //     </button>
    //   </div>

    //   {/* Fade-in animation */}
    //   <style jsx>{`
    //     .animate-fade-in {
    //       animation: fadeIn 0.4s ease-in;
    //     }
    //     @keyframes fadeIn {
    //       from {
    //         opacity: 0;
    //         transform: translateY(5px);
    //       }
    //       to {
    //         opacity: 1;
    //         transform: translateY(0);
    //       }
    //     }
    //     .scrollbar-hide::-webkit-scrollbar {
    //       display: none;
    //     }
    //     .scrollbar-hide {
    //       -ms-overflow-style: none;
    //       scrollbar-width: none;
    //     }
    //   `}</style>
    // </div>
    // <div className="w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-xl shadow-lg overflow-hidden transition-colors duration-300">
    //   <div className="max-w-2xl mx-auto h-[88vh] flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-xl shadow-lg overflow-hidden transition-colors duration-300">
    //     {/* Header */}
    //     <h1 className="text-2xl text-center bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 font-bold py-3 shadow-md">
    //       EduMate AI Chat 🤖
    //     </h1>

    //     {/* Chat messages */}
    //     <div
    //       className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-hide"
    //       id="chatBox"
    //     >
    //       {messages.map((msg, index) => (
    //         <div
    //           key={index}
    //           className={`flex items-end gap-2 ${
    //             msg.sender === "user" ? "justify-end" : "justify-start"
    //           } animate-fade-in`}
    //         >
    //           {/* AI Avatar */}
    //           {msg.sender === "ai" && (
    //             <span className="text-2xl text-white rounded-full shadow">
    //               🤖
    //             </span>
    //           )}

    //           {/* Message Bubble */}
    //           <div
    //             className={`p-3 rounded-2xl max-w-xs sm:max-w-sm text-sm shadow-md ${
    //               msg.sender === "user"
    //                 ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
    //                 : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none"
    //             }`}
    //           >
    //             <p className="whitespace-pre-line">{msg.text}</p>
    //             <p
    //               className={`text-xs mt-1 ${
    //                 msg.sender === "user"
    //                   ? "text-gray-100"
    //                   : "text-gray-500 dark:text-gray-400"
    //               } text-right`}
    //             >
    //               {msg.timestamp}
    //             </p>
    //           </div>

    //           {/* User Avatar */}
    //           {msg.sender === "user" && (
    //             <span className="text-2xl text-white rounded-full shadow">
    //               👤
    //             </span>
    //           )}
    //         </div>
    //       ))}

    //       {/* Typing Indicator */}
    //       {isTyping && (
    //         <div className="flex items-center gap-2 animate-pulse">
    //           <span className="text-2xl text-white rounded-full shadow">
    //             🤖
    //           </span>
    //           <div className="bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm px-4 py-2">
    //             AI is typing...
    //           </div>
    //         </div>
    //       )}

    //       <div ref={scrollRef}></div>
    //     </div>

    //     {/* Suggestions Section */}
    //     <div className="bg-gray-50 dark:bg-gray-800 p-3 border-t border-gray-300 dark:border-gray-700">
    //       <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
    //         💡 Try asking:
    //       </p>
    //       <div className="flex flex-wrap gap-2">
    //         {[
    //           "Give me resume tips",
    //           "Generate study notes for JavaScript",
    //           "What projects can I add to my portfolio?",
    //           "How to prepare for interviews?",
    //         ].map((s, i) => (
    //           <button
    //             key={i}
    //             onClick={() => setInput(s)}
    //             className="px-3 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-blue-500 hover:text-white transition"
    //           >
    //             {s}
    //           </button>
    //         ))}
    //       </div>
    //     </div>

    //     {/* Input fixed at bottom */}
    //     <div className="bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 flex items-center gap-2 p-3">
    //       <textarea
    //         className="flex-grow p-3 border border-gray-300 dark:border-gray-700 rounded-lg resize-none overflow-y-auto bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
    //         placeholder="Ask about resume, project ideas, notes..."
    //         rows={1}
    //         value={input}
    //         onChange={(e) => setInput(e.target.value)}
    //       />
    //       <button
    //         onClick={askAI}
    //         className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-lg shadow-md hover:scale-105 transition-transform duration-200 shrink-0"
    //       >
    //         Ask AI
    //       </button>
    //     </div>

    //     {/* Styles */}
    //     <style jsx>{`
    //       .animate-fade-in {
    //         animation: fadeIn 0.4s ease-in;
    //       }
    //       @keyframes fadeIn {
    //         from {
    //           opacity: 0;
    //           transform: translateY(5px);
    //         }
    //         to {
    //           opacity: 1;
    //           transform: translateY(0);
    //         }
    //       }
    //       .scrollbar-hide::-webkit-scrollbar {
    //         display: none;
    //       }
    //       .scrollbar-hide {
    //         -ms-overflow-style: none;
    //         scrollbar-width: none;
    //       }
    //     `}</style>
    //   </div>
    // </div>
      <div className="flex w-full max-w-6xl mx-auto h-[85vh] rounded-xl shadow-lg overflow-hidden scroll-smooth transition-colors duration-300 border-[1px] border-gray-700 dark:border-gray-300">
        {/* Chat Section */}
        <div
          className={`flex flex-col flex-1 transition-all duration-300 ${
            isPanelOpen ? "md:w-2/3" : "w-full"
          }`}
        >
          {/* Header */}
          <h1 className="text-2xl text-center bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 font-bold dark:text-white py-3 shadow-md">
            EduMate AI Chat 🤖
          </h1>

          {/* Chat messages */}
          {/* <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-hide"> */}
            <div
              className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-hide"
              id="chatBox"
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-end gap-2 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  } animate-fade-in`}
                >
                  {/* AI Avatar */}
                  {msg.sender === "ai" && (
                    <span className="text-2xl text-white rounded-full shadow">
                      🤖
                    </span>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`p-3 rounded-2xl max-w-xs sm:max-w-sm text-sm shadow-md ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
                        : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === "user"
                          ? "text-gray-100"
                          : "text-gray-500 dark:text-gray-400"
                      } text-right`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>

                  {/* User Avatar */}
                  {msg.sender === "user" && (
                    <span className="text-2xl text-white rounded-full shadow">
                      👤
                    </span>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 animate-pulse">
                  <span className="text-2xl text-white rounded-full shadow">
                    🤖
                  </span>
                  <div className="bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm px-4 py-2">
                    AI is typing...
                  </div>
                </div>
              )}

              <div ref={scrollRef}></div>
            </div>
          {/* </div> */}

          {/* Suggestions */}
          <div className=" bg-gray-50 dark:bg-gray-800 p-2 border-t border-gray-300 dark:border-gray-700 max-sm:h-[2.5rem] overflow-scroll">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              💡 Try asking:
            </p>
            <div className="flex flex-wrap gap-2 ">
              {[
                "Give me resume tips",
                "Generate study notes for JavaScript",
                "What projects can I add to my portfolio?",
                "How to prepare for interviews?",
              ].map((s, i) => (
                <button
                  key={i}
                  onClick={() => setInput(s)}
                  className="px-3 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-blue-500 dark:text-white hover:text-gray-300 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Input box */}
          <div className="bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 flex items-center gap-2 p-2">
            <textarea
              className="flex-grow p-3 border border-gray-300 dark:border-gray-700 rounded-lg resize-none bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ask about resume, project ideas, notes..."
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              onClick={askAI}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-lg shadow-md hover:scale-105 transition-transform duration-200 shrink-0"
            >
              Ask AI
            </button>
          </div>
        </div>

        {/* Side Panel */}
        <div
          className={`hidden md:flex flex-col w-1/3 bg-white dark:bg-gray-800 border-l border-gray-300 dark:border-gray-700 transition-all duration-300 ${
            isPanelOpen ? "block" : "hidden"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
            <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              EduMate Tips
            </h2>
            <button
              onClick={() => setIsPanelOpen(false)}
              className="text-gray-600 dark:text-gray-300 hover:text-red-500"
            >
              ✖
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <h3 className="font-semibold text-blue-500">
                📄 Resume Critique
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Upload your resume and get instant AI-powered suggestions.
              </p>
              <Link href={"/resume-critique"}>
                <button className="mt-2 text-blue-600 dark:text-blue-400 text-xs underline">
                  Open Resume Tool →
                </button>
              </Link>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <h3 className="font-semibold text-green-500">🤖 Chatbot Tips</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Ask career questions, college details, or coding help!
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <h3 className="font-semibold text-purple-500">📚 Study Notes</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Turn your raw notes into structured study material instantly.
              </p>
              <button
                onClick={() => {
                  alert("currently this feature is not active");
                }}
                className="mt-2 text-purple-600 dark:text-purple-400 text-xs underline"
              >
                Generate Notes →
              </button>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <h3 className="font-semibold text-orange-500">🎓 Portfolio</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Build a complete academic profile and showcase your skills.
              </p>
            </div>
          </div>
        </div>

        {/* Floating Help Button when panel is closed */}
        {!isPanelOpen && (
          <button
            onClick={() => setIsPanelOpen(true)}
            className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:scale-105 transition"
          >
            ❓ Tips
          </button>
        )}
      </div>
  );
}
