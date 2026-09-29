const app = require('./app');
const config = require('./config/env');

const server = app.listen(config.port, () => {
  console.log('====================================================');
  console.log(`🚀 TEENSPEND API Server running in [${config.nodeEnv}] mode`);
  console.log(`📡 URL: http://localhost:${config.port}`);
  console.log(`🔒 Authentication: JWT Bearer Token`);
  console.log(`🌐 Allowed Client: ${config.clientUrl}`);
  console.log('====================================================');
});

// Graceful shutdown handling
const handleGracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Closing HTTP server cleanly...`);
  server.close(() => {
    console.log('Server terminated cleanly.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
