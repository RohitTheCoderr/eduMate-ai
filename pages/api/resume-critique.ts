// import { IncomingForm } from 'formidable';
// import type { Fields, Files, File } from 'formidable';
import  {IncomingForm, Fields, Files, File } from 'formidable';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import { OpenAI } from 'openai';

export const config = {
  api: {
    bodyParser: false,
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: 'https://openrouter.ai/api/v1',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const form = new IncomingForm({ keepExtensions: true });

   const data = await new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files }); // 👈 Ensure this shape is correct
    });
  });


  if (!data || !data.files || !data.files.file) {
    return res.status(500).json({ error: 'Form parsing failed' });
  }

  const uploadedFile = Array.isArray(data.files.file)
    ? data.files.file[0]
    : (data.files.file as File);

  const fileBuffer = fs.readFileSync(uploadedFile.filepath);
  const pdfData = await pdfParse(fileBuffer);
  const resumeText = pdfData.text;

  const completion = await openai.chat.completions.create({
    model: "qwen/qwen3-coder:free", // or gpt-4
    messages: [
      {
        role: "user",
        content: `Please critique the following resume and give suggestions to improve it:\n\n${resumeText}`,
      },
    ],
  });

  const aiFeedback = completion.choices[0].message.content;

  return res.status(200).json({
    message: 'Resume uploaded and parsed',
    contentPreview: aiFeedback,
  });
}
