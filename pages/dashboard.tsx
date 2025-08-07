import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import missionImg from "@/Assets/mission2.png"; // Import the image
import Connect from "@/components/connect";

export default function Dashboard() {
  const [userName, setUserName] = useState("User");
  const router = useRouter();

  useEffect(() => {
    // Get user data from localStorage (or your backend auth)
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user && user.fullName) {
      setUserName(user.fullName.split(" ")[0]); // first name only
    }
  }, []);

  return (
    // <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300 p-6">
    <div className="">
      <div className="max-w-6xl mx-auto">
        {/* Welcome */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Welcome back, {userName}! 👋
        </h1>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Resume Critique */}
          <Link
            href="/resume-critique"
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="text-blue-600 text-4xl">📄</div>
              <div>
                <h2 className="text-xl font-semibold group-hover:text-blue-600">
                  Resume Critique
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Upload & get AI-powered improvements
                </p>
              </div>
            </div>
          </Link>

          {/* AI Chatbot */}
          <Link
            href="/chatbot"
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="text-green-600 text-4xl">🤖</div>
              <div>
                <h2 className="text-xl font-semibold group-hover:text-green-600">
                  AI Chatbot
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Ask college, career, or tech questions
                </p>
              </div>
            </div>
          </Link>

          {/* Study Notes Generator */}
          <Link
            href="/whiteboard"
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="text-purple-600 text-4xl">📝</div>
              <div>
                <h2 className="text-xl font-semibold group-hover:text-purple-600">
                  Study Notes Generator
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Generate subject-wise study notes
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Mission Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow text-center">
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
            EduMate is dedicated to empowering students by providing AI-powered 
            tools and resources to enhance career readiness, encourage innovation, 
            and simplify learning. We help students turn their ideas into reality 
            with powerful features and a strong community.
          </p>
        </div>

        {/* FAQs Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-6 text-center">
            ❓ Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <details className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <summary className="font-semibold cursor-pointer">
                How does the Resume Critique work?
              </summary>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Our AI analyzes your uploaded resume and provides instant suggestions 
                to make it more professional and ATS-friendly.
              </p>
            </details>

            <details className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <summary className="font-semibold cursor-pointer">
                Can I use EduMate for free?
              </summary>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Yes! Most of our core features are completely free for students.
              </p>
            </details>

            <details className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <summary className="font-semibold cursor-pointer">
                Will my data remain private?
              </summary>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Absolutely. We prioritize user privacy and never share your data with third parties.
              </p>
            </details>
          </div>
        </div>
        <Connect />
      </div>
    </div>
  );
}





// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import Link from "next/link";

// export default function Dashboard() {
//   const [userName, setUserName] = useState("User");
//   const router = useRouter();

//   useEffect(() => {
//     // Replace with actual logic to get user info
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     if (user && user.fullName) {
//       setUserName(user.fullName.split(" ")[0]); // just first name
//     }
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-5xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6 text-gray-800">
//           Welcome back, {userName}! 👋
//         </h1>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Resume Critique */}
//           <Link
//             href="/resume"
//             className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300 group"
//           >
//             <div className="flex items-center gap-4">
//               <div className="text-blue-600 text-4xl">📄</div>
//               <div>
//                 <h2 className="text-xl font-semibold group-hover:text-blue-600">
//                   Resume Critique
//                 </h2>
//                 <p className="text-gray-500 text-sm">Upload & improve your resume</p>
//               </div>
//             </div>
//           </Link>

//           {/* AI Chatbot */}
//           <Link
//             href="/chatbot"
//             className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300 group"
//           >
//             <div className="flex items-center gap-4">
//               <div className="text-green-600 text-4xl">🤖</div>
//               <div>
//                 <h2 className="text-xl font-semibold group-hover:text-green-600">
//                   AI Chatbot
//                 </h2>
//                 <p className="text-gray-500 text-sm">Ask college or tech-related questions</p>
//               </div>
//             </div>
//           </Link>

//           {/* Study Notes Generator */}
//           <Link
//             href="/notes"
//             className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300 group"
//           >
//             <div className="flex items-center gap-4">
//               <div className="text-purple-600 text-4xl">📝</div>
//               <div>
//                 <h2 className="text-xl font-semibold group-hover:text-purple-600">
//                   Study Notes Generator
//                 </h2>
//                 <p className="text-gray-500 text-sm">Generate subject-wise notes</p>
//               </div>
//             </div>
//           </Link>
//         </div>

//         <div className="mt-10 text-center text-gray-500 text-sm">
//           EduMate – Empowering Students to Turn Ideas into Reality 🚀
//         </div>
//       </div>
//     </div>
//   );
// }
