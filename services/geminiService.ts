import { GoogleGenAI } from "@google/genai";
import { DivinationResult } from "../types";

// 声明 process 变量以通过 TypeScript 编译检查
declare const process: {
  env: {
    API_KEY: string;
  };
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const interpretGua = async (result: DivinationResult): Promise<string> => {
  // 检查 API KEY 是否配置
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined') {
    return "【天机未启】检测到系统尚未配置 API Key。请在 Vercel 后台的 Environment Variables 中添加 API_KEY 变量，然后重新部署。";
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

  const MAX_RETRIES = 2;
  let lastError: any = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const text = response.text;
      if (text) return text;
      throw new Error("Empty response");
    } catch (error: any) {
      lastError = error;
      console.warn(`第 ${attempt + 1} 次尝试失败:`, error);
      if (attempt < MAX_RETRIES - 1) await sleep(2000);
    }
  }

  return `【大师闭关中】暂时无法连接星宿。原因：${lastError?.message || '未知错误'}。请稍后再试。`;
};