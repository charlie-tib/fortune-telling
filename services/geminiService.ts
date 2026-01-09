// 该服务已停用，改用 aiService.ts (DeepSeek)
// 移除 @google/genai 引用以修复构建错误

import { DivinationResult } from "../types";

export const interpretGua = async (_result: DivinationResult): Promise<string> => {
  return "服务已迁移，请检查 aiService.ts";
};
