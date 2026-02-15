import express from 'express';
import urlRoutes from './routes/urls';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/', urlRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

export { app };
