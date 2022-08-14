const express = require("express");
const router = express.Router();

const Bootcamp = require("../models/bootcamp-model");
const advancedResults = require("../middleware/advanced-results");
const { protect, authorize } = require("../middleware/authorization");
const { getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius, bootcampPhotoUpload } = require("../controllers/bootcamps-controllers");

router.route("/").get(advancedResults(Bootcamp, "courses"), getBootcamps).post(protect, authorize("publisher", "admin"), createBootcamp);
router.route("/:id").get(getBootcamp).put(protect, authorize("publisher", "admin"), updateBootcamp).delete(protect, authorize("publisher", "admin"), deleteBootcamp);
router.route("/:id/photo").put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

// Include other recources router
const courseRouter = require("./courses-routes");
const reviewRouter = require("./reviews-routes");
// Re-Route into other recource routers
router.use("/:bootcampID/courses", courseRouter);
router.use("/:bootcampID/reviews", reviewRouter);

module.exports = router;
