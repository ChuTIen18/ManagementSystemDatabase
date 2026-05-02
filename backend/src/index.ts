import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/orders.js';
import menuRoutes from './routes/menu.js';
import userRoutes from './routes/users.js';
import scheduleRoutes from './routes/schedules.js';
import attendanceRoutes from './routes/attendance.js';
import salaryRoutes from './routes/salary.js';
import leaveRequestRoutes from './routes/leave-requests.js';
import inventoryRoutes from './routes/inventory.js';
import equipmentRoutes from './routes/equipment.js';
import promotionsRoutes from './routes/promotions.js';
import tablesRoutes from './routes/tables.js';
import feedbackRoutes from './routes/feedback.js';
import reportsRoutes from './routes/reports.js';
import { ensureDatabaseSchema } from './infrastructure/schemaBootstrap.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

// Middleware
app.use(
    cors({
        origin(origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error(`CORS origin not allowed: ${origin}`));
        },
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', message: 'Coffee House API is running' });
});

// Routes
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/schedules`, scheduleRoutes);
app.use(`${API_PREFIX}/attendance`, attendanceRoutes);
app.use(`${API_PREFIX}/salary`, salaryRoutes);
app.use(`${API_PREFIX}/leave-requests`, leaveRequestRoutes);
app.use(`${API_PREFIX}/inventory`, inventoryRoutes);
app.use(`${API_PREFIX}/equipment`, equipmentRoutes);
app.use(`${API_PREFIX}/promotions`, promotionsRoutes);
app.use(`${API_PREFIX}/tables`, tablesRoutes);
app.use(`${API_PREFIX}/feedback`, feedbackRoutes);
app.use(`${API_PREFIX}/reports`, reportsRoutes);
app.use(`${API_PREFIX}/orders`, orderRoutes);
app.use(`${API_PREFIX}/menu`, menuRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        error: {
            code: 'NOT_FOUND',
            message: 'Endpoint not found',
        },
    });
});

// Error handler
app.use((err: any, req: Request, res: Response) => {
    console.error('Error:', err);
    res.status(500).json({
        error: {
            code: 'INTERNAL_ERROR',
            message: err.message || 'Internal server error',
        },
    });
});

async function startServer() {
    await ensureDatabaseSchema();

    app.listen(PORT, () => {
        console.log(`✅ Coffee House API running on http://localhost:${PORT}`);
        console.log(`📍 API Prefix: ${API_PREFIX}`);
    });
}

startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
