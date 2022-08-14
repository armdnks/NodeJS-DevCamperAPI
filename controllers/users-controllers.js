const asyncHandler = require("../middleware/async-handler");
const ErrorResponse = require("../utils/error-response");
const sendEmail = require("../utils/send-email");
const User = require("../models/user-model");

/**
 * @desc    GET ALL USERS
 * @route   GET /api/v1/users
 * @access  private/admin
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @desc    GET SINGLE USER
 * @route   GET /api/v1/users/:id
 * @access  private/admin
 */
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({ success: true, data: user });
});

/**
 * @desc    CREATE USER
 * @route   POST /api/v1/users
 * @access  private/admin
 */
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
});

/**
 * @desc    UPDATE USER
 * @route   PUT /api/v1/users/:id
 * @access  private/admin
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: user });
});

/**
 * @desc    DELETE USER
 * @route   DELETE /api/v1/users/:id
 * @access  private/admin
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "user deleted" });
});
