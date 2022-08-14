const asyncHandler = require("../middleware/async-handler");
const ErrorResponse = require("../utils/error-response");
const Bootcamp = require("../models/bootcamp-model");
const Course = require("../models/course-model");
const Review = require("../models/review-model");

/**
 * @desc    GET REVIEWS
 * @route   GET /api/v1/reviews
 * @route   GET /api/v1/bootcamp/:bootcampID/reviews
 * @access  public
 */
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampID) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampID });
    return res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

/**
 * @desc    GET SINGLE REVIEW
 * @route   GET /api/v1/reviews/:id
 * @access  public
 */
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!review) return next(new ErrorResponse(`No reviews found with ID: ${req.params.id}`, 404));

  res.status(200).json({ success: true, data: review });
});

/**
 * @desc    ADD REVIEW
 * @route   POST /api/v1/bootcamp/:bootcampID/reviews
 * @access  private
 */
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampID;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampID);
  if (!bootcamp) return next(new ErrorResponse(`No bootcamp with ID: ${req.params.bootcampID}`, 404));

  const review = await Review.create(req.body);

  res.status(201).json({ success: true, data: review });
});

/**
 * @desc    UPDATE REVIEW
 * @route   GET /api/v1/reviews/:id
 * @access  private
 */
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) return next(new ErrorResponse(`No review with ID: ${req.params.bootcampID}`, 404));

  // Check review belongs to the user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorize to update this review`, 401));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: review });
});

/**
 * @desc    DELETE REVIEW
 * @route   DELETE /api/v1/reviews/:id
 * @access  private
 */
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new ErrorResponse(`No review with ID: ${req.params.bootcampID}`, 404));

  // Check review belongs to the user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorize to delete this review`, 401));
  }

  await review.remove();

  res.status(200).json({ success: true, message: "review deleted" });
});
