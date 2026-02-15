# URL Shortening API

Simple URL shortener - give it a long URL, get back a short one. Built with Express and TypeScript. Uses SQLite for persistence.

## Setup

```bash
npm install
```

## Running

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

Server runs on port 3000. Copy `.env.example` to `.env` if you want to change `PORT` or `BASE_URL`.

## Endpoints

**POST /shorten** – Shorten a URL

Request body:
```json
{ "url": "https://www.example.com/some/long/path" }
```

Returns `{ "shortUrl": "http://localhost:3000/abc123" }`. Invalid or missing URLs return 400.

**GET /:shortCode** – Redirects to the original URL (302). 404 if not found.

**GET /health** – Returns `{ "status": "ok" }`.

## Try it

```bash
curl -X POST http://localhost:3000/shorten -H "Content-Type: application/json" -d '{"url":"https://google.com"}'
```

Then open the shortUrl from the response in your browser, or:
```bash
curl -L http://localhost:3000/abc123
```

## Design notes

- **Storage:** SQLite. Same long URL returns the same short code (idempotent). DB file is `urls.db` in project root.
- **Short codes:** Base62, 6 chars, random. Retries a few times if we hit a collision.
- **Validation:** Uses `URL` constructor – rejects empty, malformed, or non-http(s) URLs.

## Future improvements

Things I'd add or change for production:

- **Centralized error handling** – One error-handler middleware instead of scattered try/catch. Consistent error format, easier logging, cleaner routes.
- **Async** – Use an async DB driver (e.g. `mysql2` for MySQL) so the server can handle more concurrent requests
- **MySQL** – Better for concurrency than SQLite; SQLite is fine for a single instance
- **Redis** – Cache hot short codes in front of the DB to speed up redirects
- **Click tracking** – Store or increment a counter on each redirect
- **URL expiry** – Add `expires_at` and return 410 when a link has expired
- **Tests** – Integration tests for the API
- **Rate limiting** – Throttle requests to reduce abuse
- **Logging** – Structured logs for debugging and monitoring
