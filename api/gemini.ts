import { GoogleGenAI } from '@google/genai';
import { requireUser } from '../server/auth';

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }
  const user = await requireUser(request, response);
  if (!user) return;
  // Paid upstream calls require a server-managed entitlement.
  if (user.app_metadata?.subscription !== 'premium' && user.app_metadata?.role !== 'admin') {
    return response.status(403).json({ error: 'Premium subscription required.' });
  }
  if (!process.env.GEMINI_API_KEY) {
    return response.status(503).json({ error: 'AI service is not configured.' });
  }
  const { contents, config } = request.body || {};
  if (typeof contents !== 'string' || contents.length === 0 || contents.length > 40000) {
    return response.status(400).json({ error: 'Invalid prompt.' });
  }
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const result = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3-flash-preview',
      contents,
      config: {
        responseMimeType: config?.responseMimeType,
        responseSchema: config?.responseSchema,
        temperature: typeof config?.temperature === 'number' ? Math.min(2, Math.max(0, config.temperature)) : undefined,
        maxOutputTokens: 8192,
      },
    });
    return response.status(200).json({ text: result.text });
  } catch {
    return response.status(502).json({ error: 'AI service unavailable.' });
  }
}
