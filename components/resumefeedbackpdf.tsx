"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { format } from "date-fns";

const ResumeFeedbackPDF = ({ userId ,refress }: { userId: string, refress:boolean }) => {
  const [pdfs, setPdfs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPDFs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

        console.log("pdf tdt", data);
        

      if (error) {
        console.error("Failed to fetch PDFs:", error.message);
      } else {
        setPdfs(data);
      }
      setLoading(false);
    };

    if (userId) fetchPDFs();
  }, [userId,refress]);

  return (
    <div className="p-4 max-h-screen bg-gray-100 overflow-y-auto">
      <h2 className="text-lg font-bold mb-3">Your Resume Feedback PDFs</h2>
      {loading ? (
        <p>Loading...</p>
      ) : pdfs.length === 0 ? (
        <p>No PDFs uploaded yet.</p>
      ) : (
        <ul className="space-y-3">
          {pdfs.map((pdf) => (
            <li key={pdf.id} className="border rounded p-3 shadow">
              <a
                href={pdf.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                📄 View PDF
              </a>
              <div className="text-sm text-gray-600">
                Uploaded on: {format(new Date(pdf.created_at), "PPpp")}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResumeFeedbackPDF;
