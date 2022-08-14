const express = require("express");
const router = express.Router({ mergeParams: true });

const Review = require("../models/review-model");
const advancedResults = require("../middleware/advanced-results");
const { protect, authorize } = require("../middleware/authorization");
const { getReviews, getReview, addReview, updateReview, deleteReview } = require("../controllers/reviews-controllers");

router
  .route("/")
  .get(advancedResults(Review, { path: "bootcamp", select: "name description" }), getReviews)
  .post(protect, authorize("user", "admin"), addReview);
router.route("/:id").get(getReview).put(protect, authorize("user", "admin"), updateReview).delete(protect, authorize("user", "admin"), deleteReview);

module.exports = router;
