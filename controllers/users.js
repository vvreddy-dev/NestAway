const User = require("../models/user.js");
const Listing = require("../models/listing.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to NestAway");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to NestAway!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};

module.exports.bookListing = async (req, res) => {
    const userId = req.user._id;
    const listingId = req.params.listingId;
    const user = await User.findById(userId);
    if (!user.bookings.includes(listingId)) {
        user.bookings.push(listingId);
        await user.save();
        req.flash("success", "Listing booked successfully!");
    } else {
        req.flash("info", "You have already booked this listing.");
    }
    res.redirect("/cart");
};

module.exports.viewCart = async (req, res) => {
    const user = await User.findById(req.user._id).populate("bookings");
    res.render("users/cart.ejs", { bookings: user.bookings });
};

module.exports.cancelBooking = async (req, res) => {
    const userId = req.user._id;
    const listingId = req.params.listingId;
    await User.findByIdAndUpdate(userId, { $pull: { bookings: listingId } });
    req.flash("success", "Booking cancelled.");
    res.redirect("/cart");
};
