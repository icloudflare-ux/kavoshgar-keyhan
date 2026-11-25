import { beforeEach, describe, expect, it, vi } from 'vitest';
const { requireUser, generateContent } = vi.hoisted(() => ({ requireUser: vi.fn(), generateContent: vi.fn() }));
vi.mock('../server/auth', () => ({ requireUser }));
vi.mock('@google/genai', () => ({ GoogleGenAI: class { models = { generateContent }; } }));
import gemini from '../api/gemini';
import telegram from '../api/send-telegram';

const response = () => {
  const res = { status: vi.fn(), json: vi.fn(), setHeader: vi.fn() };
  res.status.mockReturnValue(res);
  return res;
};
beforeEach(() => {
  vi.resetAllMocks();
  vi.unstubAllEnvs();
});

describe('API authorization and validation', () => {
  it.each([gemini, telegram])('rejects non-POST requests', async handler => {
    const res = response();
    await handler({ method: 'GET' }, res);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(requireUser).not.toHaveBeenCalled();
  });
  it.each([gemini, telegram])('stops when server authentication fails', async handler => {
    requireUser.mockResolvedValue(null);
    const res = response();
    await handler({ method: 'POST' }, res);
    expect(generateContent).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
  it('does not accept a free account for paid AI calls', async () => {
    requireUser.mockResolvedValue({ app_metadata: {}, user_metadata: { subscription: 'premium' } });
    const res = response();
    await gemini({ method: 'POST', body: { contents: 'hello' } }, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });
  it('requires an administrator for Telegram broadcasting', async () => {
    requireUser.mockResolvedValue({ app_metadata: { subscription: 'premium' } });
    const res = response();
    await telegram({ method: 'POST' }, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });
  it('fails closed when the server key is missing', async () => {
    vi.stubEnv('GEMINI_API_KEY', '');
    requireUser.mockResolvedValue({ app_metadata: { subscription: 'premium' } });
    const res = response();
    await gemini({ method: 'POST', body: { contents: 'hello' } }, res);
    expect(res.status).toHaveBeenCalledWith(503);
  });
  it('uses the server model and a bounded output, not client overrides', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-only-key');
    vi.stubEnv('GEMINI_MODEL', 'server-selected-model');
    requireUser.mockResolvedValue({ app_metadata: { subscription: 'premium' } });
    generateContent.mockResolvedValue({ text: 'answer' });
    const res = response();
    await gemini({ method: 'POST', body: { model: 'untrusted', contents: 'hello', config: { maxOutputTokens: 999999 } } }, res);
    expect(generateContent).toHaveBeenCalledWith(expect.objectContaining({ model: 'server-selected-model', config: expect.objectContaining({ maxOutputTokens: 8192 }) }));
    expect(res.json).toHaveBeenCalledWith({ text: 'answer' });
  });
});
