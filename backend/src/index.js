import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Cursed Commits API is alive!',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════╗
║  🎮 Cursed Commits API Server     ║
║  Running on: http://localhost:${PORT}
║  Status: Ready! 🚀                ║
╚════════════════════════════════════╝
  `);
});