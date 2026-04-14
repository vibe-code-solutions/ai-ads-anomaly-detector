import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import fs from "fs";

const data = JSON.parse(
  fs.readFileSync(new URL("./data.json", import.meta.url))
);
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const app = express();

app.use(cors());
app.use(express.json());

// тестовий маршрут
app.get("/", (req, res) => {
  res.send("AI Ads Detector працює 🚀");
});
// НОВИЙ маршрут (ДОДАЄМО)
app.get("/campaigns", (req, res) => {
  res.json(data);
});
//маршрут для AI-аналізу
app.get("/analyze", async (req, res) => {
  try {
        const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
        {
          role: "system",
          content: "You are a marketing analyst. Find anomalies in ad campaign data."
        },
        {
          role: "user",
          content: `Return ONLY valid JSON. No explanations.

        Format:
        {
        "anomalies": [
            {
            "campaign_name": "...",
            "issue": "...",
            "severity": "Low | Medium | High"
            }
        ]
        }

        Data: ${JSON.stringify(data)}`
        }
      ]
    });

    const aiResponse = response.choices[0].message.content;

let parsed;

try {
  // 1. очищаємо від ```json ``` якщо є
  const cleaned = aiResponse
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  // 2. пробуємо парсити
  parsed = JSON.parse(cleaned);

} catch (e) {
  console.error("Parse error:", e);

  return res.status(500).json({
    error: "Invalid JSON from AI",
    raw: aiResponse
  });
}

res.json(parsed);

} catch (error) {
  console.error("OpenAI error:", error);

  res.status(500).json({
    error: "Failed to analyze campaigns"
  });
}

});

// запуск сервера
app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});