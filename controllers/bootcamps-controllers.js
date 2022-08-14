const fs = require("fs");
const path = require("path");
const asyncHandler = require("../middleware/async-handler");
const ErrorResponse = require("../utils/error-response");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/bootcamp-model");

/**
 * @desc    GET ALL BOOTCAMPS
 * @route   GET /api/v1/bootcamps
 * @access  public
 */
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @desc    GET SINGLE BOOTCAMP
 * @route   GET /api/v1/bootcamps/:id
 * @access  public
 */
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) return next(new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404));
  res.status(200).json({ success: true, data: bootcamp });
});

/**
 * @desc    CREATE NEW BOOTCAMP
 * @route   POST /api/v1/bootcamps
 * @access  private
 */
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;
  // Check for published bootcamp
  const publishedBootcam = await Bootcamp.findOne({ user: req.user.id });
  // If the user is not an admin, they can only add one bootcamp
  if (publishedBootcam && req.user.role !== "admin") {
    return next(new ErrorResponse(`The user with ID: ${req.user.id} has already published a bootcamp`, 400));
  }

  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

/**
 * @desc    UPDATE BOOTCAMP
 * @route   PUT /api/v1/bootcamps/:id
 * @access  private
 */
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) return next(new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404));

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`The user with ID: ${req.user.id} is not authorized to update this bootcamp`, 401));
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: bootcamp });
});

/**
 * @desc    DELETE BOOTCAMP
 * @route   DELETE /api/v1/bootcamps/:id
 * @access  private
 */
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) return next(new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404));

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`The user with ID: ${req.user.id} is not authorized to delete this bootcamp`, 401));
  }

  fs.unlink(path.resolve(`${process.env.FILE_UPLOAD_PATH}/${bootcamp.photo}`), (err) => {
    if (err) throw err;
    console.log("Photo deleted...".red);
  });

  bootcamp.remove();

  res.status(200).json({ success: true, message: "bootcamp deleted" });
});

/**
 * @desc    GET BOOTCAMPS WITHIN A RADIUS
 * @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
 * @access  public
 */
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/long from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const long = loc[0].longitude;

  // Calc radius using radians
  // Divide distance by radius of Earth
  // Earth Radius = 3,963 mi | 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[long, lat], radius] },
    },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

/**
 * @desc    UPLOAD PHOTO FOR BOOTCAMP
 * @route   PUT /api/v1/bootcamps/:id/photo
 * @access  private
 */
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) return next(new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404));

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`The user with ID: ${req.user.id} is not authorized to delete this bootcamp`, 401));
  }

  if (!req.files) return next(new ErrorResponse(`Please upload a file`, 400));

  const file = req.files.file;
  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) return next(new ErrorResponse(`Please upload an image file`, 400));
  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD / 1000000}MB`, 400));
  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
