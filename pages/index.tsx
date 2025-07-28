"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Resumeuploader from "../components/ResumeUpload";
import Link from "next/link";

export default function Home() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    async function getData() {
      try {
        const { data, error } = await supabase.from("users").select("*");
        if (error) throw error;
        setUsers(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    getData();
  }, []);

  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-12">
        <div className="text-center max-w-5xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-700 drop-shadow-sm">
            Welcome to <span className="text-blue-500">EduMate AI</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-700">
            Empowering students with smart tools to{" "}
            <span className="font-medium text-blue-600">excel</span> in their
            academic and professional journey.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2 text-left">
            <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition-all">
              <h3 className="text-xl font-semibold text-blue-700">
                📄 Smart Resume Critique
              </h3>
              <p className="mt-2 text-gray-600">
                Upload your resume and receive instant feedback with actionable
                insights powered by AI.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition-all">
              <h3 className="text-xl font-semibold text-blue-700">
                🤖 AI Chat Assistant
              </h3>
              <p className="mt-2 text-gray-600">
                Get answers to your doubts on careers, colleges, projects, and
                more with our friendly chatbot.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition-all">
              <h3 className="text-xl font-semibold text-blue-700">
                📚 Study Notes Generator
              </h3>
              <p className="mt-2 text-gray-600">
                Turn your raw lecture notes into well-structured study material
                quickly and easily.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition-all">
              <h3 className="text-xl font-semibold text-blue-700">
                🎓 Student Portfolio
              </h3>
              <p className="mt-2 text-gray-600">
                Build your own academic portfolio with projects, achievements,
                and resume in one place.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <Link  href="/dashboard">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
