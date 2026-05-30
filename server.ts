import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";

function logDebug(message: string) {
  try {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(path.join(process.cwd(), "api-debug.log"), `[${timestamp}] ${message}\n`);
  } catch (err) {
    console.error("Failed to write to debug log:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API path for generating essay reflection
  app.post("/api/generate-essay", async (req, res) => {
    logDebug(`Received POST request of keywords: ${JSON.stringify(req.body)}`);
    try {
      const { keywords } = req.body;
      if (!keywords || typeof keywords !== "string" || !keywords.trim()) {
        logDebug("Error: No keywords provided");
        res.status(400).json({ error: "키워드를 입력해주세요." });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        logDebug("Error: GEMINI_API_KEY is not defined in process.env");
        res.status(500).json({ 
          error: "GEMINI_API_KEY가 설정되지 않았습니다. AI Studio Secrets 패널에서 API 키를 설정해주세요." 
        });
        return;
      }

      logDebug("Success: apiKey detected, length of key: " + apiKey.length);

      // Lazy load GoogleGenAI as recommended for API Key Safety
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `독도 영토 주권 교육 수업을 마친 후 작성하는 학생 평화 지향형 성찰 소감문(Reflective Essay)을 작성하고자 합니다.
다음 제공된 키워드들을 성실하게 고려하고 녹여내어, 역사적 사실에 기반하면서도 한일 간 평화적 우호와 공동 협력을 추구하는 품격 있는 성찰 소감문을 한글(Korean)로 구성해 주세요.

학생이 입력한 키워드: ${keywords}

서술 약정 규칙:
1. 문맥과 제목이 정돈된 수려하고 깊이 있는 인문학적 문체로 진중하게 서술해 주세요.
2. 지나치게 감정적인 비방('왜놈', '도독놈' 등의 원색 비난)을 절제하고, 『세종실록지리지』나 『태정관 지령』 등 학습한 사료들의 객관적 합리와 상생 협력의 가치를 담아주세요.
3. 보기 편하게 3~4개의 논리적인 문단으로 나누고, 문단 시작에 소제목(Subtitle)을 붙여주세요.
4. 독자(미래 세대 학생)에게 평화와 인류 보편의 진실에 대한 울림을 줄 수 있게 작성해 주세요.
5. 마크다운(Markdown) 문법을 유려하게 활용하여 단락을 정교하게 구분하고 가독성을 극대하게 높여 반환해 주세요.`;

      logDebug("Calling Gemini model: gemini-3.5-flash with prompt");
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an outstanding educator in geopolitics and international peace relations. You help students write rational, evidence-based, and inspiring reflective essays for historical learning.",
          temperature: 0.7,
        }
      });

      const essay = response.text;
      logDebug(`Successfully generated essay of length: ${essay ? essay.length : 0}`);
      res.json({ essay });
    } catch (error: any) {
      logDebug(`Gemini API Error details: ${error?.stack || error?.message || error}`);
      console.error("Gemini API Error Error:", error);
      res.status(500).json({ error: error.message || "소감문 생성 중 오류가 발생했습니다." });
    }
  });

  // Vite middleware for development
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

startServer();
