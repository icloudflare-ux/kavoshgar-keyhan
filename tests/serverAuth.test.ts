import { afterEach, describe, expect, it, vi } from 'vitest';
const { getUser } = vi.hoisted(() => ({ getUser: vi.fn() }));
vi.mock('@supabase/supabase-js', () => ({ createClient: () => ({ auth: { getUser } }) }));
import { requireUser } from '../server/auth';

const response = () => {
  const res = { status: vi.fn(), json: vi.fn() };
  res.status.mockReturnValue(res);
  return res;
};
afterEach(() => { vi.unstubAllEnvs(); vi.resetAllMocks(); });
const configure = () => {
  vi.stubEnv('SUPABASE_URL', 'https://test.invalid');
  vi.stubEnv('SUPABASE_ANON_KEY', 'test-public-key');
};
describe('server session verification', () => {
  it('rejects requests without bearer credentials', async () => {
    configure();
    const res = response();
    expect(await requireUser({ headers: {} }, res)).toBeNull();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(getUser).not.toHaveBeenCalled();
  });
  it('verifies bearer tokens with Supabase rather than decoding them locally', async () => {
    configure();
    getUser.mockResolvedValue({ data: { user: { id: 'verified-user' } }, error: null });
    expect(await requireUser({ headers: { authorization: 'Bearer test-session' } }, response())).toEqual({ id: 'verified-user' });
    expect(getUser).toHaveBeenCalledWith('test-session');
  });
  it('rejects an expired or forged token', async () => {
    configure();
    getUser.mockResolvedValue({ data: { user: null }, error: new Error('invalid') });
    const res = response();
    expect(await requireUser({ headers: { authorization: 'Bearer forged' } }, res)).toBeNull();
    expect(res.status).toHaveBeenCalledWith(401);
  });
  it('fails closed when the auth provider is unreachable', async () => {
    configure();
    getUser.mockRejectedValue(new Error('network unavailable'));
    const res = response();
    expect(await requireUser({ headers: { authorization: 'Bearer test' } }, res)).toBeNull();
    expect(res.status).toHaveBeenCalledWith(503);
  });
});
