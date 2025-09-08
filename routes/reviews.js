const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewController = require("../controllers/reviews");
const { isLoggedIn, validateReview, isAuthor } = require("../middleware");
const WrapAsync = require("../utils/WrapAsync");

// Create Review
router.post("/", isLoggedIn, validateReview, WrapAsync(reviewController.createReview));

// Delete Review
router.delete("/:reviewId", isLoggedIn, isAuthor, WrapAsync(reviewController.deleteReview));

module.exports = router;
