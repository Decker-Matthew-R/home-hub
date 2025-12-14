import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import hueRoutes from './routes/hueRoutes';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/hue', hueRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Listen on all network interfaces
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log(`🌐 Network: http://192.168.1.2:${PORT}`);
});