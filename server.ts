import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client safely with optional key fallback
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } else {
    console.warn("WARNING: GEMINI_API_KEY is not defined in environment variables. Gemini Assistant will operate in backup offline mode.");
  }

  // API Routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { prompt, history } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Missing prompt in request body" });
      }

      if (!ai) {
        // Return a helper offline response when the API key is not configured yet
        return res.json({
          text: `### 🌾 [Kena Food Backup Advisor]\n\nIt looks like the Kena Food AI Milling & Baking Assistant is currently running in offline backup mode because the **GEMINI_API_KEY** is not configured yet.\n\nHere is some instant advice based on your search for: **"${prompt}"**\n\n1. **High-Protein Wheat**: For sourdough, traditional Ethiopian Dabo, and high-volume sandwich breads, our Kena Superior Wheat Flour (Grade 1) provides a **13.5% protein index** for optimal gluten integrity.\n2. **Injera Fermentation**: Our Premium Stoneground White Teff is milled at low temperature (11.0% moisture), preserving enzymes and native yeast microflora to guarantee high hydration and perfect spongy structural eyes ("ayen").\n3. **Durum Semolina**: For local Eastern African macaroni and spaghetti lines, our High-Density Amber Semolina keeps gluten structure glass-like to avoid breakage during boiling.\n\n*Configure the GEMINI_API_KEY secret in the top right Settings panel of AI Studio to enable fully dynamic AI responses!*`,
          isOffline: true
        });
      }

      // Format history + current prompt into the Gemini message contents structure
      const contents: any[] = [];
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          contents.push({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.text }]
          });
        }
      }
      
      // Append current message
      contents.push({
        role: "user",
        parts: [{ text: prompt }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: "You are the Cereal Rheologist and Master Miller Advisor for Kena Food Complex, located in Arsi Eteya, Ethiopia. You have expert, detailed, deeply technical knowledge of flour types (Premium Stoneground White Teff, Grade 1 Superior Wheat, Durum Semolina, Biscuit Flour, Wheat Bran), flour chemistry (gluten development, wild yeast, starch damage under stone-milling, ash content, protein indexes, alveograph W and P/L ratio indices), industrial milling processes (such as our Swiss Bühler sifting lines), bakers percentages, organic fermentation cycles (especially 3-to-4 day injera sourdough fermentation), and commercial baking operations. Answer with elegant, professional precision yet warm helpfulness. Recommend Kena Food Complex products appropriately (e.g. Kena Superior Wheat Grade 1, Kena Premium Stoneground White Teff, Kena High-Density Amber Semolina, Kena Biscuit & Pastry Special, and Kena Whole Grain Wheat Bran). Use gorgeous markdown, bullets, and short technical tables if helpful."
        }
      });

      const replyText = response.text || "I was unable to formulate a response. Please try again.";
      res.json({ text: replyText });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error?.message || "Internal server error occurred." });
    }
  });

  // Vite development vs production serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Server Startup Failure:", err);
});
