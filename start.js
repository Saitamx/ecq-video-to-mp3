const app = require('./index');
const config = require('./config');

console.log('🚀 Starting ECQ Video to MP3 Converter...');
console.log(`📡 Server will run on port ${config.port}`);
console.log('🔧 Configuration loaded successfully');

// Graceful shutdown handling
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

console.log('✅ Server started successfully!');
console.log('🌐 Open http://localhost:' + config.port + ' in your browser');
console.log('📋 API documentation available at http://localhost:' + config.port);
