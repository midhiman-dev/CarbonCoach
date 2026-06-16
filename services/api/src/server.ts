import express from 'express';
import { coachRouter } from './coach/coachRoutes';

export const app = express();

// Limit payloads to protect against large context inputs
app.use(express.json({ limit: '10kb' }));

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'carboncoach-api',
  });
});

app.use('/api', coachRouter);

const PORT = process.env.PORT || 8080;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
