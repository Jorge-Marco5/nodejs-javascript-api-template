import { AppError } from '#utils/appError.js';
import logger from '#config/logger.js';

const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    logger.error(`AppError: ${err.message}`);
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  logger.error(`Error no manejado: ${err.message}`);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack,
    }),
  });
};

export default errorHandler;
