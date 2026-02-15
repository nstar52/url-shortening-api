import request from 'supertest';
import fs from 'fs';
import { app } from './app';

const testDbPath = process.env.DATABASE_PATH!;

afterAll(() => {
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
});

describe('URL shortening API', () => {
  it('shortens a URL and redirects', async () => {
    const shortenRes = await request(app)
      .post('/shorten')
      .send({ url: 'https://example.com' })
      .expect(201);

    const shortUrl = shortenRes.body.shortUrl;
    expect(shortUrl).toMatch(/\/[a-zA-Z0-9]{6}$/);

    const shortCode = shortUrl.split('/').pop();
    await request(app)
      .get(`/${shortCode}`)
      .expect(302)
      .expect('Location', 'https://example.com');
  });

  it('returns 400 for invalid URL', async () => {
    await request(app)
      .post('/shorten')
      .send({ url: 'not-a-url' })
      .expect(400);
  });
});
