const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {
    validateReivew,
    isLoggedIn,
    isReviewAuthor,
} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

// Reviews - Post Route
router.post(
    "/",
    isLoggedIn,
    validateReivew,
    wrapAsync(reviewController.createReview)
);

// Review - Delete Route
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;
