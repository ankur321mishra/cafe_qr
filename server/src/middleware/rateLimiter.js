import rateLimit from 'express-rate-limit';

const skipDev = () => process.env.NODE_ENV !== 'production';

/**
 * General API rate limiter: 100 requests per 15 minutes per IP.
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipDev,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT',
      message: 'Too many requests, please try again later',
    },
  },
});

/**
 * Auth endpoint rate limiter: 5 attempts per 15 minutes per IP.
 * Protects against brute-force login attacks.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipDev,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT',
      message: 'Too many login attempts, please try again later',
    },
  },
});

/**
 * Order creation rate limiter: 10 orders per 5 minutes per IP.
 * Prevents order spam from customers.
 */
export const orderLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipDev,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT',
      message: 'Too many orders placed, please wait a moment',
    },
  },
});
