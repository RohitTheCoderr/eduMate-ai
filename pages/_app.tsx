// import '@/styles/globals.css'; // ✅ Global Tailwind styles
import "../styles/globals.css"
import type { AppProps } from 'next/app';
import Navbar from '@/components/Navbar';
import EduMateFooter from "@/components/Footer";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar /> {/* Will be shown on all pages */}
      <div className="w-full pt-[6rem]  text-gray-800 dark:text-gray-100 p-6 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4 py-12 transition-colors duration-300">
      <Component {...pageProps} />
      </div>
      <EduMateFooter />
    </>
  );
}
