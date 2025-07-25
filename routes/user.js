const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");

const userController = require("../controllers/users.js");

// User Signup
router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

// User Login
router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        userController.login
    );

router.get("/logout", userController.logout);

// Booking a listing
router.post(
    "/book/:listingId",
    isLoggedIn,
    wrapAsync(userController.bookListing)
);
// Viewing cart
router.get("/cart", isLoggedIn, wrapAsync(userController.viewCart));
// Cancelling a booking
router.post(
    "/cart/cancel/:listingId",
    isLoggedIn,
    wrapAsync(userController.cancelBooking)
);

module.exports = router;
