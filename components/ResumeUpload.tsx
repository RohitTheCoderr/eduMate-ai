// components/ResumeUploader.tsx
"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ResumeUploader({ userId }: { userId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    const { data, error } = await supabase.storage
      .from("resumes")
      .upload(`${userId}/${file.name}`, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) return setMessage("❌ Upload failed");

    setMessage("✅ Resume uploaded successfully!");
  };

  return (
    <div className="space-y-4">
      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleUpload}>
        Upload Resume
      </button>
      <p>{message}</p>
    </div>
  );
}
