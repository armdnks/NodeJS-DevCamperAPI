const jwt = require("jsonwebtoken");
const asyncHandler = require("./async-handler");
const ErrorResponse = require("../utils/error-response");
const User = require("../models/user-model");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    // Set token from Bearer token in header
    // split into array and get second item = the token
    token = req.headers.authorization.split(" ")[1];
  }
  // Set token from cookie
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  if (!token) return next(new ErrorResponse("Not authorized to access this route", 401));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    // console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return next(new ErrorResponse(`User with role: ${req.user.role} is not authorized to access this route`, 403));
    next();
  };
};
