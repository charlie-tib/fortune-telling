import { DivinationResult } from "../types";

declare const process: {
  env: {
    API_KEY: string;
  };
};

export const interpretGua = async (result: DivinationResult): Promise<string> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    return "【天机未设】尚未检测到有效 API Key。\n\n请在环境变量中设置 API_KEY（DeepSeek 的 Key 通常以 sk- 开头）。";
  }

  const prompt = `
    你是一位精通《周易》与《梅花易数》的易学大师。请根据以下卦象为用户提供深度解析。
    
    用户想预测的事：${result.question}
    
    卦象信息：
    - 本卦：${result.benGua.name}（上卦为${result.benGua.upper.nature}${result.benGua.upper.name}，下卦为${result.benGua.lower.nature}${result.benGua.lower.name}）
    - 互卦：${result.huGua.name}
    - 变卦：${result.bianGua.name}
    - 动爻：第${result.changingLine}爻
    
    解析要求：
    1. 首先简述本卦的卦辞大意。
    2. 分析“体用”关系（本卦中不动的那一卦为体，动的那一卦为用，结合五行生克）。
    3. 结合互卦和变卦进行推断。
    4. 给出具体的行动建议。
    
    请用 Markdown 格式输出。
  `;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是一位精通易经的大师。' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2048
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const msg = errorData.error?.message || `HTTP ${response.status}`;
      
      if (response.status === 401) {
        throw new Error("API Key 无效。请确认您填写的是 DeepSeek 的 sk- 密钥。");
      }
      if (response.status === 429) {
        throw new Error("DeepSeek 账户余额不足或请求过快，请检查账户。");
      }
      throw new Error(msg);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: any) {
    console.error("AI 接口调用异常:", error);
    if (error.name === 'AbortError') {
      return "【天机迟缓】AI 响应超时，可能是网络不佳或大师正在深度推演，请稍后再试。";
    }
    return `【大师闭关】暂时无法获取天机。\n\n**原因：** ${error.message}\n**建议：** 请确认环境变量 API_KEY 为 DeepSeek 的密钥（以 sk- 开头），并检查账户余额。`;
  }
};
