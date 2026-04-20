const request = require('supertest');

describe('POST /api/chat', () => {
  let app;

  beforeEach(() => {
    jest.resetModules();
    process.env.GEMINI_API_KEY = 'test_key';
    global.fetch = jest.fn();
    app = require('../server');
  });

  afterEach(() => {
    delete process.env.GEMINI_API_KEY;
    delete global.fetch;
  });

  test('400 if message missing', async () => {
    const res = await request(app).post('/api/chat').send({ prompt: '', context: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/message is required/i);
  });

  test('500 if GEMINI_API_KEY missing', async () => {
    delete process.env.GEMINI_API_KEY;
    const res = await request(app).post('/api/chat').send({ message: 'hi', prompt: '', context: '' });
    expect(res.status).toBe(500);
  });

  test('502 if Gemini returns non-OK', async () => {
    global.fetch.mockResolvedValue({ ok: false, text: async () => 'bad', status: 500 });
    const res = await request(app).post('/api/chat').send({ message: 'hi', prompt: '', context: '' });
    expect(res.status).toBe(502);
    expect(res.body.error).toMatch(/Gemini API request failed/);
  });

  test('200 returns text on success', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: 'pong' }] } }] })
    });

    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'ping', prompt: 'Respond with pong.', context: '' });

    expect(res.status).toBe(200);
    expect(res.body.text).toBe('pong');
  });
});
