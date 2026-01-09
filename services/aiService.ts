import { DivinationResult } from "../types";

export const interpretGua = async (result: DivinationResult): Promise<string> => {
  try {
    // 使用 Cloudflare Pages Functions 作为代理，解决国内访问问题
    const response = await fetch("/api/interpret", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: result.question,
        benGua: result.benGua.name,
        huGua: result.huGua.name,
        bianGua: result.bianGua.name,
        changingLine: result.changingLine,
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.interpretation || "灵犀未通，请稍后再试。";
  } catch (error: any) {
    console.error("Interpretation Error:", error);
    return `链接乾坤失败：${error.message}。请稍后再试。`;
  }
};