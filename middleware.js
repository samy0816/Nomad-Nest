
const Listing=require("./models/listing.js");

const Review = require("./models/review.js");
const ExpressError=require("./utils/ExpressError.js");
const { listingSchema } = require("./utils/Schema.js");
const { reviewSchema } = require("./utils/Schema.js");

module.exports.isLoggedIn = (req, res, next) => { 
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // fixed typo
        req.flash("error", "You must be logged in to add new listing!");
        res.redirect("/login"); // added return
    } else {
        next();
    }
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner= async(req, res, next) => {
    let {id}=req.params;
    const listing= await Listing.findById(id);

    // Check if listing exists
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    // Check if listing has an owner and if current user is the owner
    if (!listing.owner || !res.locals.currentUser || !listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You don't have permission to perform this operation!");
        return res.redirect(`/listings/${listing._id}`);
    }

    next();
};

module.exports.validateListing = (req, res, next) => {
    const result = listingSchema.validate(req.body);
    if (result.error) {
        throw new ExpressError(400, result.error.details[0].message);
    } else {
        next();
    }
};


module.exports.validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body);
    if (result.error) {
        throw new ExpressError(400, result.error.details[0].message);
    } else {
        next();
    }
};

module.exports.isAuthor= async(req, res, next) => {
    let {id, reviewId}=req.params;
    const review= await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id))
        {
            req.flash("error","You dont have permission to perform this operation!");
            res.redirect(`/listings/${id}`);
        }
    else{
        next();
    }
};