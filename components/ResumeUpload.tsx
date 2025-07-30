import { useEffect, useState } from "react";
import ResumeFeedback from "./resumefeedback";
// import html2pdf from "html2pdf.js";
import { supabase } from "@/lib/supabaseClient"; // 👈 update your Supabase client path
import { v4 as uuidv4 } from "uuid";
import ResumeFeedbackPDF from "./resumefeedbackpdf";
import { useRouter } from "next/router";

//  for safeing error when reload because html2pdf is ssr by default
// import dynamic from "next/dynamic";
// const html2pdf = dynamic(() => import("html2pdf.js"), { ssr: false });

export default function ResumeUploader() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [savingPdf, setSavingPdf] = useState(false);
  const [refress, setRefress] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  //  for get auth for login or not
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

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error.message);
      } else if (user) {
        setUserId(user.id);
      }
    };

    fetchUser();
  }, []);

  const handleUpload = async () => {
    if (!isLoggedIn) {
      alert("please login First! before upload resume");
      return router.push("/login");
    }
    if (!file) return alert("Please upload a file");

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setFeedback("");

    try {
      const res = await fetch("/api/resume-critique", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      console.log("data feedbacj", data);

      setFeedback(data?.contentPreview || "Resume uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      setFeedback("Error uploading resume. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const saveFeedbackAsPDF = async () => {
    if (!feedback || !userId) {
      alert("upload resume pdf and wait for feedback");
      return;
    }
    setSavingPdf(true);

    try {
      // 1. Create a virtual element to render feedback
      const html2pdf = (await import("html2pdf.js")).default;
      const element = document.createElement("div");
      element.innerHTML = feedback;

      const opt = {
        margin: 0.5,
        filename: "resume-feedback.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      const worker = html2pdf().set(opt).from(element);
      const pdfBlob = await worker.outputPdf("blob");
      // 3. Upload PDF to Supabase Storage
      const folder = "resume-feedbacks";
      const filename = `${folder}/${userId}-${uuidv4()}.pdf`;

      // const filename = `resume-feedbacks/${userId}-${uuidv4()}.pdf`;

      const { data, error } = await supabase.storage
        .from("resumefeedbacks") // ✅ Bucket name storage
        .upload(filename, pdfBlob, {
          contentType: "application/pdf",
        });

      if (error) throw error;

      // 4. Get Public URL
      const { data: urlData } = supabase.storage
        .from("resumefeedbacks")
        .getPublicUrl(filename);

      const publicUrl = urlData?.publicUrl;

      if (!publicUrl) throw new Error("Failed to get public URL");

      // 5. Save metadata to Supabase table
      await supabase.from("resumes").insert({
        user_id: userId,
        resume_url: publicUrl,
        created_at: new Date().toISOString(),
      });

      setRefress(true);
      alert("✅ PDF saved to Supabase for future access.");
    } catch (err: any) {
      console.error("PDF Save Error:", err.message);
      alert("❌ Failed to save PDF.");
    } finally {
      setSavingPdf(false);
      setRefress(false);
    }
  };

  return (
    // <div className="flex flex-wrap justify-center gap-4 w-full px-2 sm:w-full md:w-[90%] mx-auto mt-10">
    //   <div className=" px-6 py-8 bg-white rounded-2xl shadow-lg border border-gray-200">
    //     <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-3">
    //       📄 Smart Resume Critique
    //     </h2>
    //     <p className="text-center text-gray-600 mb-6 text-base">
    //       Upload your resume and receive instant, AI-powered feedback to improve
    //       your job chances.
    //     </p>

    //     <label
    //       htmlFor="file-upload"
    //       className="flex flex-col items-center justify-center w-full h-40 px-4 mb-4 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer hover:bg-blue-50 transition"
    //     >
    //       <svg
    //         xmlns="http://www.w3.org/2000/svg"
    //         className="w-10 h-10 text-blue-500 mb-2"
    //         fill="none"
    //         viewBox="0 0 24 24"
    //         stroke="currentColor"
    //       >
    //         <path
    //           strokeLinecap="round"
    //           strokeLinejoin="round"
    //           strokeWidth={2}
    //           d="M7 16V4m0 0L3 8m4-4l4 4m4 8h4a2 2 0 002-2v-5a2 2 0 00-2-2h-4M16 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2"
    //         />
    //       </svg>
    //       <span className="text-blue-600 font-medium">
    //         Click to upload your resume
    //       </span>
    //       <input
    //         id="file-upload"
    //         type="file"
    //         accept=".pdf,.doc,.docx"
    //         onChange={(e) => setFile(e.target.files[0])}
    //         className="hidden"
    //       />
    //       {file && (
    //         <p className="mt-2 text-sm text-gray-500">
    //           Selected: <strong>{file.name}</strong>
    //         </p>
    //       )}
    //     </label>

    //     <div className="flex max-sm:flex-wrap gap-1 justify-between ">
    //       <button
    //         onClick={handleUpload}
    //         disabled={uploading}
    //         className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6  transition disabled:opacity-50"
    //       >
    //         {uploading ? "Uploading..." : "Upload & Get Feedback"}
    //       </button>
    //       <button
    //         onClick={saveFeedbackAsPDF}
    //         disabled={savingPdf}
    //         className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 "
    //       >
    //         {savingPdf ? "Saving as PDF..." : "💾 Save Feedback as PDF"}
    //       </button>
    //     </div>

    //     {feedback && (
    //       <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-[400px] overflow-y-auto">
    //         <h3 className="text-lg font-semibold text-gray-800 mb-2">
    //           💡 Feedback:
    //         </h3>
    //         <ResumeFeedback content={feedback} />
    //       </div>
    //     )}
    //   </div>

    //   <ResumeFeedbackPDF userId={userId} refress={refress} />
    // </div>

    <div className="flex flex-wrap justify-center gap-6 w-full px-3 md:w-[90%] mx-auto mt-12">
      <div className="px-6 py-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 w-full h-full md:max-w-3xl transition-colors duration-300">
        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center text-blue-700 dark:text-blue-400 mb-3">
          📄 Smart Resume Critique
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6 text-base">
          Upload your resume and receive instant,{" "}
          <span className="font-semibold">AI-powered feedback</span> to improve
          your job chances.
        </p>

        {/* Upload Box */}
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-40 px-4 mb-6 border-2 border-dashed border-blue-400 dark:border-blue-500 rounded-lg cursor-pointer hover:bg-blue-50 dark:bg-gray-900 dark:hover:bg-gray-800 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-blue-500 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m4 8h4a2 2 0 002-2v-5a2 2 0 00-2-2h-4M16 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2"
            />
          </svg>
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            Click to upload your resume
          </span>
          <input
            id="file-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
          {file && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Selected: <strong>{file.name}</strong>
            </p>
          )}
        </label>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "🚀 Upload & Get Feedback"}
          </button>
          <button
            onClick={saveFeedbackAsPDF}
            disabled={savingPdf}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition disabled:opacity-50"
          >
            {savingPdf ? "Saving as PDF..." : "💾 Save Feedback as PDF"}
          </button>
        </div>

        {/* Feedback Section */}
        {feedback && (
          <div className="mt-8 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 max-h-[400px] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              💡 Feedback:
            </h3>
            <ResumeFeedback content={feedback} />
          </div>
        )}
      </div>

      {/* Past Feedbacks */}
      <ResumeFeedbackPDF userId={userId} refress={refress} />
    </div>

    // <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
    //   <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
    //     📄 Smart Resume Critique
    //   </h2>
    //   <p className="text-center text-gray-600 mb-6">
    //     Upload your resume and receive instant feedback with actionable insights powered by AI.
    //   </p>

    //   <input
    //     type="file"
    //     accept=".pdf,.doc,.docx"
    //     onChange={(e) => setFile(e.target.files[0])}
    //     className="mb-4 w-full file:px-4 file:py-2 file:rounded file:border-0 file:bg-blue-100 file:text-blue-700"
    //   />

    //   <button
    //     onClick={handleUpload}
    //     disabled={uploading}
    //     className="w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
    //   >
    //     {uploading ? 'Uploading...' : 'Upload & Get Feedback'}
    //   </button>

    //   {feedback && (
    //     <div className="mt-4  text-sm text-gray-700">
    //       {/* {feedback} */}
    //       <ResumeFeedback content={feedback} />

    //     </div>
    //   )}
    // </div>
  );
}
