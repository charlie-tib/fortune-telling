import { DivinationResult } from "../types";

declare const process: {
  env: {
    API_KEY: string;
  };
};

export const interpretGua = async (result: DivinationResult): Promise<string> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    return "【系统提示】尚未配置 API Key。请在环境变量中设置 DeepSeek 的 API_KEY。";
  }

  // 极简化的提示词，强制要求 AI 快速输出结论
  const prompt = `
    你是一位解卦大师。请根据卦象快速给出结论。

    问卜之事：${result.question}
    卦象：${result.benGua.name} -> ${result.huGua.name} -> ${result.bianGua.name}
    动爻：第${result.changingLine}爻

    要求：
    1. 直接点名吉凶。
    2. 结合体用给出一句话核心分析。
    3. 给出一条具体建议。
    4. 禁止废话，禁止复述。总字数控制在100字左右。
  `;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时，国内直连足够

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat', // 使用 V3 非思考模型，速度极快
        messages: [
          { role: 'system', content: '你是一个高效的解卦助手。直接回答，不要啰嗦。' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 300,
        stream: false
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `状态码: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: any) {
    if (error.name === 'AbortError') return "推演超时，请重试。";
    return `解卦失败：${error.message}`;
  }
};