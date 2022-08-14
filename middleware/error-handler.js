const ErrorResponse = require("../utils/error-response");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.log(err.stack.red);

  // CastError : Mongoose bad ObjectID
  if (err.name === "CastError") {
    // const message = `Resource not found with id: ${err.value}`;
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  // MongoServerError | 11000 : Mongoose duplicate key error
  if (err.code === 11000) {
    const message = err.keyValue ? `name ${err.keyValue.name} already exist` : "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  // ValidationError : Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((value) => value.message)
      .join(", ");

    error = new ErrorResponse(message, 404);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
