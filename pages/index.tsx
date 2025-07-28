"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ResumeUploader from "../components/ResumeUpload";

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

  console.log("hello user", users);

  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen bg-white">
        <h1 className="text-4xl font-bold text-blue-600 ">
          Welcome to EduMate AI
        </h1>
        <p className="text-gray-600 mt-4">
          Empowering students with smart tools
        </p>
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <ul>
            {users.map((user, i) => (
              <li key={i}>{JSON.stringify(user)}</li>
            ))}
          </ul>
        </div>
        {/* <ResumeUploader /> */}
      </main>
    </>
  );
}
