import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/explain", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "No code provided." });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert AI code explainer. Give clear, structured explanations with sections like 'Overview', 'Logic', and 'Output'." },
        { role: "user", content: `Explain this code:\n\n${code}` },
      ],
    });

    res.json({ explanation: response.choices[0].message.content });
  } catch (error) {
    console.error("🔥 Full Error:", error);
    res.status(500).json({
      error: error.response?.data || error.message || "Failed to generate explanation.",
    });
  }
});

app.get("/", (req, res) => res.send("✅ Backend is live"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));