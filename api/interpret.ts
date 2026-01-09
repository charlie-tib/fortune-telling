import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { question, benGua, huGua, bianGua, changingLine } = req.body;

    if (!question || !benGua || !huGua || !bianGua || !changingLine) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "你是一位精通《易经》与《梅花易数》的玄学导师。请根据卦象（本卦、互卦、变卦）及动爻，为用户解析其疑惑。语言应古典优雅且充满智慧，通过五行生克解析体用。结构：1. 卦意综述 2. 细节解析 3. 行动指引。"
          },
          {
            role: "user",
            content: `问卜：${question}\n本卦：${benGua}\n互卦：${huGua}\n变卦：${bianGua}\n变爻：第${changingLine}爻`
          }
        ],
        stream: false,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API Error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `DeepSeek API error: ${response.status}`,
        details: errorText
      });
    }

    const data = await response.json();
    const interpretation = data.choices[0]?.message?.content || "灵犀未通，请稍后再试。";
    
    return res.status(200).json({ interpretation });
  } catch (error: any) {
    console.error("Proxy Error:", error);
    return res.status(500).json({ 
      error: "链接乾坤失败",
      message: error.message 
    });
  }
}
