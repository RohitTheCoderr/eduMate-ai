import { supabase } from "@/lib/supabaseClient";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt, user_id } = req.body;

  if (!prompt || !user_id) {
    return res.status(400).json({ error: "Prompt and user_id are required" });
  }

  try {
    const responseText = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'qwen/qwen3-coder:free', // or any free model like `deepseek-chat`
        // model: 'MoonshotAI: Kimi K2 (free)', // or any free model like `deepseek-chat`
        // model: 'moonshotai/kimi-dev-72b:free', // or any free model like `deepseek-chat`
        // model: 'moonshotai/kimi-k2:free', // or any free model like `deepseek-chat`
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          // 'HTTP-Referer': 'http://localhost:3000', // for local testing
          'HTTP-Referer': 'https://edu-mate-ai-eight.vercel.app/',
        },
      }
    );
    const answer = responseText.data.choices[0]?.message?.content;

    // 🔹 Save to Supabase
    const { error } = await supabase.from("chat_messages").insert([
      {
        user_id,
        message: prompt,
        response: answer,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: "Failed to save chat to Supabase" });
    }

    res.status(200).json({ answer: answer });
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
