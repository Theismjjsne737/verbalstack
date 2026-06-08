import formidable from "formidable";
import fs from "fs";
import OpenAI from "openai";

export const config = { api: { bodyParser: false } };

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = formidable({ uploadDir: "/tmp", keepExtensions: true });

    const [, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const audioFile = files.audio?.[0] || files.audio;
    const filePath = audioFile.filepath || audioFile.path;

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
      language: "en",
    });

    fs.unlinkSync(filePath);

    return res.status(200).json({ transcript: transcription.text });

  } catch (err) {
    console.error("Transcribe error:", err);
    return res.status(500).json({ error: "Transcription failed" });
  }
}
