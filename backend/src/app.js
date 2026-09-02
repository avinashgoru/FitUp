const { ENV } = require('./config/env');

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const apiRoutes = require('./routes/index');
const { errorMiddleware } = require('./middleware/error.middleware');

const app = express();

// 1. Trust proxy if behind a load balancer
app.set('trust proxy', 1);

// 2. CORS configuration (Strictly controlled to FRONTEND_ORIGIN in production)
app.use(cors({
    origin: ENV.NODE_ENV === 'production' ? ENV.FRONTEND_ORIGIN : '*', 
    credentials: true
}));

// 3. Body Parsing with strict size limits to prevent abuse
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// 3.5 Cookie Parsing
app.use(cookieParser());

// 4. API Routes
app.use('/api/v1', apiRoutes);

// 5. Unmatched route handler (404)
app.use((req, res, next) => {
    res.status(404).json({
        error: {
            code: 'NOT_FOUND',
            message: `Cannot ${req.method} ${req.originalUrl}`
        }
    });
});

// 6. Centralized Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
