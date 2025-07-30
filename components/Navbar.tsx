// // components/Navbar.tsx
// "use client";
// import { supabase } from "@/lib/supabaseClient";
// import Link from "next/link";
// import { useEffect, useState } from "react";

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   useEffect(() => {
//     const getSession = async () => {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();
//       setIsLoggedIn(!!session);
//     };

//     getSession();

//     // Optional: Listen for auth changes
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       setIsLoggedIn(!!session);
//     });

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, []);

//   return (
//     <nav className="bg-white shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
//         {/* Logo */}
//         <Link href="/" className="text-2xl font-bold text-blue-600">
//           EduMate
//         </Link>

//         {/* Desktop Menu */}
//         <div className="hidden md:flex space-x-6">
//           <Link href="/" className="text-gray-700 hover:text-blue-600">
//             Home
//           </Link>
//           {isLoggedIn ? (
//             <Link
//               href="/dashboard"
//               className="text-gray-700 hover:text-blue-600"
//             >
//               Dashboard
//             </Link>
//           ) : (
//             <>
//               <Link href="/login" className="text-gray-700 hover:text-blue-600">
//                 Login
//               </Link>
//               <Link
//                 href="/signup"
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 Signup
//               </Link>
//             </>
//           )}
//         </div>

//         {/* Mobile Toggle Button */}
//         <button
//           className="md:hidden text-gray-700 focus:outline-none"
//           onClick={() => setMenuOpen(!menuOpen)}
//         >
//           ☰
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {/* {menuOpen && (
//         <div className="md:hidden px-4 pb-4 space-y-2">
//           <Link href="/" className="block text-gray-700 hover:text-blue-600">
//             Home
//           </Link>
//           {isLoggedIn ? (
//             <Link
//               href="/dashboard"
//               className="block text-gray-700 hover:text-blue-600"
//             >
//               Dashboard
//             </Link>
//           ) : (
//             <>
//               <Link
//                 href="/login"
//                 className="block text-gray-700 hover:text-blue-600"
//               >
//                 Login
//               </Link>
//               <Link
//                 href="/signup"
//                 className="block text-gray-700 hover:text-blue-600"
//               >
//                 Signup
//               </Link>
//             </>
//           )}
//         </div>
//       )} */}
//     </nav>
//   );
// }

// components / Navbar.tsx;

"use client";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

    // for darkmode theam
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Update theme when toggled
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-md z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:opacity-90"
        >
          EduMate
        </Link>

        {/* Desktop Menu */}
        <div className=" flex items-center space-x-3 sm:space-x-6">
          <div className=" hidden md:flex items-center space-x-3 sm:space-x-6">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Dashboard
            </Link>
            {!isLoggedIn && (
              <Link
                href="/signup"
                className="px-2 py-1 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition"
              >
                Signup
              </Link>
            )}
          </div>
          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-[5px] sm:p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition"
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <SunIcon className="w-5 h-5 text-yellow-400" />
            ) : (
              <MoonIcon className="w-5 h-5 text-gray-800" />
            )}
          </button>
          {/* Mobile Toggle Button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none text-xl font-semibold"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {!menuOpen ? "☰" : "X"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex items-center w-full px-4 pb-2  space-x-4">
          <Link
            href="/"
            className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Dashboard
          </Link>
          {!isLoggedIn && (
            <>
              <Link
                href="/chatbot"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                chatbot
              </Link>
              <Link
                href="/signup"
                className="px-2 py-1 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
