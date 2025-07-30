// File: pages/login.tsx

import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous error

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error?.message === "Email not confirmed") {
      alert(
        `Please confirm your email address. A confirmation link has been sent to your email. ${email}`
      );
    } else if (error) {
      setError(error.message);
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  return (
    <div className=" flex items-center justify-center text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-2 sm:p-4 md:p-8 rounded-2xl shadow-xl w-full max-w-md transition-colors duration-300"
      >
        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Welcome Back 👋
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
          <span className="px-2 text-gray-500 text-sm dark:text-gray-400">
            OR
          </span>
          <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
        </div>

        {/* Signup Link */}
        <div className="text-center">
          <span className="text-gray-600 dark:text-gray-300">
            Don't have an account?{" "}
          </span>
          <Link
            href="/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            Signup
          </Link>
        </div>
      </form>
    </div>
  );
}
