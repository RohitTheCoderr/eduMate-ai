import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

export default function EduMateFooter() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 py-8 transition-colors duration-300 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-center">
        {/* Brand & Description */}
        <div className="lg:col-span-2">
          <Link href={"/"}>
          <h2 className="text-3xl text-center font-extrabold text-blue-600 dark:text-blue-400">
            EduMate
          </h2>
          </Link>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            AI-powered tools to help students craft better resumes, generate
            study notes, and explore academic & professional opportunities.
          </p>

          {/* Social Icons */}
          <div className="flex justify-center gap-4 mt-4">
            <a
              href="#"
              className="bg-white dark:bg-gray-800 rounded-full p-2 shadow hover:bg-blue-600 hover:text-white transition"
            >
              <FaFacebookF size={18} />
            </a>
            <a
              href="#"
              className="bg-white dark:bg-gray-800 rounded-full p-2 shadow hover:bg-sky-400 hover:text-white transition"
            >
              <FaTwitter size={18} />
            </a>
            <a
              href="#"
              className="bg-white dark:bg-gray-800 rounded-full p-2 shadow hover:bg-blue-700 hover:text-white transition"
            >
              <FaLinkedinIn size={18} />
            </a>
            <a
              href="#"
              className="bg-white dark:bg-gray-800 rounded-full p-2 shadow hover:bg-pink-500 hover:text-white transition"
            >
              <FaInstagram size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="text-center text-gray-600 dark:text-gray-400 text-sm mt-6 border-t border-gray-300 dark:border-gray-700 pt-4">
        © {new Date().getFullYear()} EduMate AI. All rights reserved. 🚀
      </div>
    </footer>
  );
}
