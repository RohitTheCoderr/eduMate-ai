// components/Navbar.tsx
'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = false; // Replace with actual auth check (Supabase or Zustand)

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          EduMate
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-600">About</Link>
          <Link href="/chatbot" className="text-gray-700 hover:text-blue-600">Chatbot</Link>
          <Link href="/resume" className="text-gray-700 hover:text-blue-600">Resume</Link>

          {isLoggedIn ? (
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
              <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Signup</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link href="/" className="block text-gray-700 hover:text-blue-600">Home</Link>
          <Link href="/about" className="block text-gray-700 hover:text-blue-600">About</Link>
          <Link href="/chat" className="block text-gray-700 hover:text-blue-600">Chatbot</Link>
          <Link href="/resume" className="block text-gray-700 hover:text-blue-600">Resume</Link>

          {isLoggedIn ? (
            <Link href="/dashboard" className="block text-gray-700 hover:text-blue-600">Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="block text-gray-700 hover:text-blue-600">Login</Link>
              <Link href="/signup" className="block text-gray-700 hover:text-blue-600">Signup</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
