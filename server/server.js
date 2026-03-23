import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/index.js';
import errorHandler from './middlewares/errorMiddleware.js';

// Route files
import authRoutes from './routes/authRoutes.js';
import planRoutes from './routes/planRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import itrRoutes from './routes/itrRoutes.js';

// Passport config
import './config/passport.js';

// Connect to database
connectDB();

const app = express();

// Trust proxy - Required for Vercel/proxied environments to get correct IP
app.set('trust proxy', 1);

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Set security headers with relaxed COOP for Firebase Auth popups
app.use(helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Enable CORS - Place this at the very top of middleware stack
const allowedOrigins = [
    'http://localhost:5173',
    'https://taxproject-stg.vercel.app',
    'https://taxproject-api.vercel.app',
    'https://ledgerline.vercel.app'
];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
        // More flexible check for Vercel and local domains
        const isAllowed = allowedOrigins.includes(origin) || 
                         origin.endsWith('.vercel.app') || 
                         origin.includes('localhost');
        
        if (isAllowed) {
            res.header('Access-Control-Allow-Origin', origin);
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
            res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
        }
    }

    // Handle OPTIONS preflight immediately with 200 OK
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Primary CORS middleware for standard routes
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const isAllowed = allowedOrigins.includes(origin) || 
                         origin.endsWith('.vercel.app') || 
                         origin.includes('localhost');
        callback(null, isAllowed);
    },
    credentials: true
}));

// Rate limiting - Skip OPTIONS to ensure preflights aren't blocked
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    skip: (req) => req.method === 'OPTIONS',
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false }
});
app.use(limiter);

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/plans', planRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/itr', itrRoutes);

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Root Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
