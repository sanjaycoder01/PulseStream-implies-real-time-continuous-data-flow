import express from 'express';
import { CONFIG } from './config/config';
import ingestionRoutes from './routes/ingestion.routes';

const app = express();

app.use(express.json());

// Main Ingestion Routes
app.use(ingestionRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(CONFIG.PORT, () => {
  console.log(`[IngestionService] Server is running on port ${CONFIG.PORT}`);
});
