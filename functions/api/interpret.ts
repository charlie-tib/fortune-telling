// Cloudflare Pages Functions
// 参考: https://developers.cloudflare.com/pages/platform/functions/

export async function onRequestPost(context: {
  request: Request;
  env: { API_KEY?: string };
}): Promise<Response> {
  const { request, env } = context;

  const apiKey = env.API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const { question, benGua, huGua, bianGua, changingLine } = body;

    if (!question || !benGua || !huGua || !bianGua || !changingLine) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
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
      return new Response(JSON.stringify({ 
        error: `DeepSeek API error: ${response.status}`,
        details: errorText
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    const interpretation = data.choices[0]?.message?.content || "灵犀未通，请稍后再试。";
    
    return new Response(JSON.stringify({ interpretation }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error: any) {
    console.error("Proxy Error:", error);
    return new Response(JSON.stringify({ 
      error: "链接乾坤失败",
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 处理 OPTIONS 请求（CORS 预检）
export async function onRequestOptions(context: {
  request: Request;
  env: { API_KEY?: string };
}): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
