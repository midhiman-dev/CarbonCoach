import express from 'express';

export const app = express();

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'carboncoach-api',
  });
});

const PORT = process.env.PORT || 8080;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
