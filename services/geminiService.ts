
import { GoogleGenAI } from "@google/genai";
import { DivinationResult } from "../types";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const interpretGua = async (result: DivinationResult): Promise<string> => {
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
    3. 结合互卦（事物的中间发展过程）和变卦（事物的最终结果）进行推断。
    4. 给出具体的行动建议或心理疏导。
    5. 语言要古雅、庄重但不晦涩。
    
    请用 Markdown 格式输出。
  `;

  const MAX_RETRIES = 3;
  let lastError: any = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // 每次请求前实例化，确保使用最新的环境配置
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // 使用最稳定的调用方式
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      // 直接通过 .text 属性获取结果
      const text = response.text;
      if (text) {
        return text;
      }
      
      throw new Error("Empty response");
    } catch (error: any) {
      lastError = error;
      console.warn(`Gemini 尝试第 ${attempt + 1} 次失败:`, error);
      
      if (attempt < MAX_RETRIES - 1) {
        // 指数退避重试 (1s, 2s, 4s)
        await sleep(Math.pow(2, attempt) * 1000);
      }
    }
  }

  console.error("Gemini 调用最终失败:", lastError);
  
  // 针对 RPC/500 错误给用户更友好的提示
  if (lastError?.message?.includes("500") || lastError?.message?.includes("Rpc failed") || lastError?.message?.includes("xhr")) {
    return "【天机扰动】目前连接易学星宿的路径受阻（服务器连接超时）。这通常是暂时的，请您稍等片刻，再次点击“开启 AI 深度解卦”重试。";
  }
  
  return "大师正在闭关，暂无法感知天机。请稍后再试。";
};
