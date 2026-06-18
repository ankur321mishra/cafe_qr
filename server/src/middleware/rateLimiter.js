import rateLimit from 'express-rate-limit';

const skipDev = () => process.env.NODE_ENV !== 'production';

/**
 * General API rate limiter
 */
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipDev,
  message: {
    error: 'Too many requests. Please slow down.',
  },
});

/**
 * Auth endpoint rate limiter
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipDev,
  message: {
    error: 'Too many login attempts. Please try again in 15 minutes.',
  },
});

/**
 * Order creation rate limiter
 */
export const orderLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipDev,
  message: {
    error: 'Too many orders submitted. Please wait a moment and try again.',
  },
});
