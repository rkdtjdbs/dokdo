import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json());

// API health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "vercel-serverless-endpoint" });
});

// API path for generating essay reflection
app.post("/api/generate-essay", async (req, res) => {
  try {
    const { keywords } = req.body;
    if (!keywords || typeof keywords !== "string" || !keywords.trim()) {
      res.status(400).json({ error: "키워드를 입력해주세요." });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ 
        error: "GEMINI_API_KEY가 설정되지 않았습니다. Vercel Project Settings > Environment Variables에서 설정해주세요." 
      });
      return;
    }

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

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an outstanding educator in geopolitics and international peace relations. You help students write rational, evidence-based, and inspiring reflective essays for historical learning.",
        temperature: 0.7,
      }
    });

    const essay = response.text;
    res.json({ essay });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "소감문 생성 중 오류가 발생했습니다." });
  }
});

export default app;
