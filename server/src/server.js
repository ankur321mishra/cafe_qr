import app from './app.js';
import config from './config/index.js';
import prisma from './config/database.js';
import logger from './middleware/requestLogger.js';

if (!process.env.FRONTEND_URL) {
  console.warn(
    '[CafeQR] WARNING: FRONTEND_URL env var is not set. ' +
    'CORS will only allow localhost origins. ' +
    'Set FRONTEND_URL in your Render environment variables.'
  )
}

// Graceful shutdown handling
const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

async function gracefulShutdown(signal) {
  logger.info(`Received ${signal}, initiating graceful shutdown...`);
  try {
    await prisma.$disconnect();
    logger.info('Database connection closed.');
    process.exit(0);
  } catch (err) {
    logger.error('Error during shutdown:', err);
    process.exit(1);
  }
}

signals.forEach((signal) => {
  process.on(signal, () => gracefulShutdown(signal));
});

// Start server
async function startServer() {
  try {
    // Verify DB connection
    await prisma.$connect();
    logger.info('Connected to PostgreSQL database');

    const server = app.listen(config.port, () => {
      logger.info(`Server running in ${config.env} mode on port ${config.port}`);
    });

    server.on('error', (error) => {
      logger.error('Server error:', error);
      process.exit(1);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
