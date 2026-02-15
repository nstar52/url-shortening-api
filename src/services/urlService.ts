import { generateShortCode } from '../utils/shortCode';
import { isValidUrl } from '../utils/validateUrl';
import * as storage from '../storage/sqliteStorage';

const MAX_COLLISION_RETRIES = 5;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export function shorten(longUrl: string): { shortUrl: string } | { error: string } {
  if (!isValidUrl(longUrl)) {
    return { error: 'Invalid URL. Must be a valid http or https URL.' };
  }

  const normalizedUrl = longUrl.trim();

  const existing = storage.findByLongUrl(normalizedUrl);
  if (existing) {
    return { shortUrl: `${BASE_URL}/${existing}` };
  }

  // retry if we hit a collision
  for (let i = 0; i < MAX_COLLISION_RETRIES; i++) {
    const shortCode = generateShortCode();
    if (!storage.findByShortCode(shortCode)) {
      storage.save(normalizedUrl, shortCode);
      return { shortUrl: `${BASE_URL}/${shortCode}` };
    }
  }

  return { error: 'Failed to generate unique short code. Please try again.' };
}

export function resolve(shortCode: string): string | null {
  return storage.findByShortCode(shortCode);
}
