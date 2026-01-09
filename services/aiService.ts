import { DivinationResult } from "../types";

export const interpretGua = async (result: DivinationResult): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "系统配置异常：未检测到密钥。";

  try {
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
            content: `问卜：${result.question}\n本卦：${result.benGua.name}\n互卦：${result.huGua.name}\n变卦：${result.bianGua.name}\n变爻：第${result.changingLine}爻`
          }
        ],
        stream: false,
        temperature: 0.7
      })
    });

    const data = await response.json();
    return data.choices[0].message.content || "灵犀未通，请稍后再试。";
  } catch (error: any) {
    console.error("DeepSeek API Error:", error);
    return `链接乾坤失败：${error.message}。请确保您的网络环境支持访问 DeepSeek 接口。`;
  }
};