/**
 * Centralized Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('🔥 Server Error:', err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : err.name || 'Error',
  });
};

module.exports = errorHandler;
