import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

import config from './config/index.js';
import corsOptions from './config/cors.js';
import { requestLogger } from './middleware/requestLogger.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { NotFoundError } from './utils/apiError.js';
import apiRoutes from './routes/index.js';

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. CORS
app.use(cors(corsOptions));

// 3. Body parsers (limit payload size to prevent DOS)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 4. Cookie parser (for refresh tokens)
app.use(cookieParser());

// 5. Request Logging (pino)
app.use(requestLogger);

// 6. Global Rate Limiter
app.use('/api', generalLimiter);

// 7. Mount API Routes
app.use('/api/v1', apiRoutes);

// Serve uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 8. Handle 404s
app.use((req, res, next) => {
  next(new NotFoundError('API Route'));
});

// 9. Global Error Handler (must be last)
app.use(errorHandler);

export default app;
