/**
 * Centralized Error Handling Middleware
 * Always responds with JSON — never HTML — so mobile clients can parse errors correctly.
 */
const errorHandler = (err, req, res, next) => {
  console.error('🔥 Server Error:', err.message || err);

  // Make sure we always send JSON even if Express tried to set a different content type
  if (res.headersSent) return;

  const statusCode = (res.statusCode && res.statusCode !== 200) ? res.statusCode : 500;

  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors?.map(e => e.message).join(', ') || err.message;
    return res.status(400).json({
      success: false,
      message: messages,
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired. Please log in again.' });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An internal server error occurred.',
  });
};

module.exports = errorHandler;
