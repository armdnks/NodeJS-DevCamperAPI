const asyncHandler = require("../middleware/async-handler");
const ErrorResponse = require("../utils/error-response");
const Bootcamp = require("../models/bootcamp-model");
const Course = require("../models/course-model");

/**
 * @desc    GET COURSES
 * @route   GET /api/v1/courses
 * @route   GET /api/v1/bootcamp/:bootcampID/courses
 * @access  public
 */
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampID) {
    const courses = await Course.find({ bootcamp: req.params.bootcampID });
    return res.status(200).json({ success: true, count: courses.length, data: courses });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

/**
 * @desc    GET SINGLE COURSE
 * @route   GET /api/v1/courses/:id
 * @access  public
 */
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) return next(new ErrorResponse(`No course with ID: ${req.params.id}`, 404));

  res.status(200).json({ success: true, data: course });
});

/**
 * @desc    CREATE NEW COURSES
 * @route   POST /api/v1/bootcamp/:bootcampID/courses
 * @access  private
 */
exports.createCourse = asyncHandler(async (req, res, next) => {
  // req.body.bootcamp is referring to course-model
  req.body.bootcamp = req.params.bootcampID;
  // req.body.user is referring to course-model
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampID);
  if (!bootcamp) return next(new ErrorResponse(`No bootcamp with ID: ${req.params.bootcampID}`, 404));

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`The user with ID: ${req.user.id} is not authorized to add course to bootcamp with ID: ${bootcamp._id}`, 401));
  }

  const course = await Course.create(req.body);

  res.status(201).json({ success: true, data: course });
});

/**
 * @desc    UPDATE COURSES
 * @route   PUT /api/v1/courses/:id
 * @access  private
 */
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) return next(new ErrorResponse(`No course with ID: ${req.params.id}`, 404));

  // Make sure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`The user with ID: ${req.user.id} is not authorized to update course with ID: ${course._id}`, 401));
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: course });
});

/**
 * @desc    DELETE COURSES
 * @route   DELETE /api/v1/courses/:id
 * @access  private
 */
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) return next(new ErrorResponse(`No course with ID: ${req.params.id}`, 404));

  // Make sure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`The user with ID: ${req.user.id} is not authorized to delete course with ID: ${course._id}`, 401));
  }

  await course.remove();

  res.status(200).json({ success: true, data: {} });
});
