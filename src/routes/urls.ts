import { Router } from 'express';
import * as urlService from '../services/urlService';

const router = Router();

router.post('/shorten', (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const result = urlService.shorten(url);
  if ('error' in result) {
    return res.status(400).json({ error: result.error });
  }

  return res.status(201).json({ shortUrl: result.shortUrl });
});

router.get('/:shortCode', (req, res) => {
  const { shortCode } = req.params;
  const longUrl = urlService.resolve(shortCode);

  if (!longUrl) {
    return res.status(404).json({ error: 'Short URL not found' });
  }

  return res.redirect(302, longUrl);
});

export default router;
