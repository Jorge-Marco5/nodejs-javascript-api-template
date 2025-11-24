import app from './src/app.js';
import logger from './src/config/logger.js';
import { connectToDatabase } from './src/config/database.js';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.clear(); // Limpia la consola al reiniciar
  connectToDatabase()
    .then(() => {
      logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      logger.info(
        '📄 Conectado a la base de datos: ' + process.env.DATABASE_PROVIDER
      );
      logger.info('🚀 Servidor corriendo en http://localhost:' + PORT);
      logger.info('📍 Modo: ' + process.env.NODE_ENV);
      logger.info('📚 Docs: http://localhost:' + PORT + '/api-docs');
      logger.info('💚 Health: http://localhost:' + PORT + '/health');
      logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    })
    .catch(error => {
      logger.error('📄 Error al conectar a la base de datos:', error);
    });
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM recibido, cerrando servidor...');
  server.close(() => {
    logger.info('✅ Servidor cerrado');
    process.exit(0);
  });
});

// Evitar que nodemon muestre errores dobles
process.on('uncaughtException', err => {
  logger.error('❌ Excepción no capturada:', err);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  logger.error('❌ Promise rechazado:', err);
  server.close(() => process.exit(1));
});
