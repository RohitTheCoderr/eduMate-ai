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
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow w-full max-w-sm"
      >
        <h2 className="text-xl mb-4 font-bold">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3 w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="flex gap-4 mt-8">
          Create Account
          <Link
            href="/signup"
            className="px-4 py-2 text-blue-500 rounded hover:text-blue-700"
          >
            Signup
          </Link>
        </div>
      </form>
    </div>
  );
}
