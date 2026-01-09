// Cloudflare Pages Functions 类型定义
export interface PagesFunctionContext<Env = any, P extends string = any, Data = any> {
  request: Request;
  functionPath: string;
  waitUntil: (promise: Promise<any>) => void;
  passThroughOnException: () => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  env: Env & { API_KEY?: string };
  params: Record<P, string>;
  data: Data;
}
