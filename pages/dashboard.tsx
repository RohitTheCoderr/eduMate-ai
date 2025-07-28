import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Dashboard() {
  const [userName, setUserName] = useState("User");
  const router = useRouter();

  useEffect(() => {
    // Replace with actual logic to get user info
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user && user.fullName) {
      setUserName(user.fullName.split(" ")[0]); // just first name
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Welcome back, {userName}! 👋
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Resume Critique */}
          <Link
            href="/resume"
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="text-blue-600 text-4xl">📄</div>
              <div>
                <h2 className="text-xl font-semibold group-hover:text-blue-600">
                  Resume Critique
                </h2>
                <p className="text-gray-500 text-sm">Upload & improve your resume</p>
              </div>
            </div>
          </Link>

          {/* AI Chatbot */}
          <Link
            href="/chatbot"
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="text-green-600 text-4xl">🤖</div>
              <div>
                <h2 className="text-xl font-semibold group-hover:text-green-600">
                  AI Chatbot
                </h2>
                <p className="text-gray-500 text-sm">Ask college or tech-related questions</p>
              </div>
            </div>
          </Link>

          {/* Study Notes Generator */}
          <Link
            href="/notes"
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="text-purple-600 text-4xl">📝</div>
              <div>
                <h2 className="text-xl font-semibold group-hover:text-purple-600">
                  Study Notes Generator
                </h2>
                <p className="text-gray-500 text-sm">Generate subject-wise notes</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-10 text-center text-gray-500 text-sm">
          EduMate – Empowering Students to Turn Ideas into Reality 🚀
        </div>
      </div>
    </div>
  );
}
