"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import missionImg from "@/Assets/mission2.png"; // Import the image
import Head from "next/head";

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
      <Head>
        <title>EduMate - Empower Students</title>
        <meta
          name="description"
          content="EduMate helps students turn ideas into reality."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/mission2.png" />
      </Head>

      <main className="flex flex-col items-center justify-center text-gray-800 dark:text-gray-100 ">
        <div className="text-center max-w-5xl">
          {/* Hero Section */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-700 dark:text-blue-400 drop-shadow-sm">
            Welcome to{" "}
            <span className="text-blue-500 dark:text-blue-300">EduMate AI</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-700 dark:text-gray-300">
            Empowering students with smart tools to{" "}
            <span className="font-medium text-blue-600 dark:text-blue-400">
              excel
            </span>{" "}
            in their academic and professional journey.
          </p>

          {/* Features Section */}
          <div className="mt-10 grid gap-6 md:grid-cols-2 text-left">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition-all">
              <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400">
                📄 Smart Resume Critique
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Upload your resume and receive instant feedback with actionable
                insights powered by AI.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition-all">
              <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400">
                🤖 AI Chat Assistant
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Get answers to your doubts on careers, colleges, projects, and
                more with our friendly chatbot.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition-all">
              <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400">
                📚 Study Notes Generator
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Turn your raw lecture notes into well-structured study material
                quickly and easily.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition-all">
              <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400">
                🎓 Student Portfolio
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Build your own academic portfolio with projects, achievements,
                and resume in one place.
              </p>
            </div>
          </div>

          {/* Mission Section */}
          <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow p-8">
            <div className="flex gap-3 justify-center items-center mb-4">
              <Image
                src={missionImg}
                alt="Mission"
                width={64} // You can use exact width/height
                height={64}
                className="w-[3rem] h-auto"
              />
              <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400 ">
                Our Mission
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              EduMate AI is dedicated to empowering students through innovative
              tools and resources. Our mission is to provide AI-driven solutions
              that simplify learning, improve job readiness, and help students
              showcase their talents to the world.
            </p>
          </div>

          {/* Why Choose Us */}
          <div className="mt-16 text-left">
            <h2 className="text-3xl font-bold text-purple-700 dark:text-purple-400 mb-6 text-center">
              🌟 Why Choose EduMate AI?
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                  AI-Powered Tools
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  All features are built using the latest AI technology to
                  deliver accurate, fast, and reliable results.
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                  Student-Centered
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Designed specifically for students, keeping their academic and
                  career needs in mind.
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                  Secure & Private
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  We value your privacy and ensure that your data is never
                  shared with third parties.
                </p>
              </div>
            </div>
          </div>

          {/* Call To Action */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              🚀 Ready to Start Your Journey?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Join EduMate AI and unlock the tools that will help you succeed in
              academics and beyond.
            </p>
            <Link
              href={"/dashboard"}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full shadow-lg transition-transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
