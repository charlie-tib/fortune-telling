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

  // 极简化的提示词，强制要求 AI 快速输出结论，不进行发散和复述
  const prompt = `
    你是一位梅花易数解卦专家。请针对以下卦象，用精炼、直白的语言快速给出结论。

    问卜之事：${result.question}
    卦象：${result.benGua.name}(本) -> ${result.huGua.name}(互) -> ${result.bianGua.name}(变)
    动爻：第${result.changingLine}爻

    要求：
    1. 直接点名吉凶趋势。
    2. 基于体用生克（${result.benGua.upper.nature}与${result.benGua.lower.nature}）给出一句话核心分析。
    3. 给出1-2条具体的行动建议。
    4. 禁止废话，禁止解释什么是梅花易数。总字数控制在200字以内。
  `;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 压缩到15秒超时，追求快

    // 默认使用 DeepSeek V3 (deepseek-chat)，不带思考过程，速度极快
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat', 
        messages: [
          { role: 'system', content: '你是一个精简高效的解卦助手。直接回答结论，不准复述背景，不准啰嗦。' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.6, // 略微调低温度，增加稳定性
        max_tokens: 500,  // 限制输出长度，加快首词返回
        stream: false     // 同步返回
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
    console.error("AI 接口异常:", error);
    if (error.name === 'AbortError') return "【提示】推演时间过长，请检查网络。";
    return `【连接失败】原因：${error.message}。建议检查 API Key 是否正确。`;
  }
};
