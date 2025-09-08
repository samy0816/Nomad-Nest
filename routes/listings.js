const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listings");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const WrapAsync = require("../utils/WrapAsync");
const{storage}=require("../cloudConfig.js");
const multer=require('multer');
const upload=multer({storage});

// API route for AI itinerary generation - moved to main app.js
// router.post("/api/generate-itinerary", (req, res, next) => {
//     console.log('API route hit:', req.method, req.path);
//     console.log('Request body:', req.body);
//     next();
// }, WrapAsync(listingController.generateItinerary));

// List all and create new listing
router.route("/")
  .get(WrapAsync(listingController.index))
  .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, WrapAsync(listingController.updateListing))

// New listing form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Edit and update a listing
router.route("/:id")
  .get(WrapAsync(listingController.showListing))
  .put(isLoggedIn, isOwner, upload.single('listing[image]'),validateListing, listingController.updateListing)
  .delete(isLoggedIn, isOwner, listingController.deleteListing);

// Edit form
router.get("/:id/edit", isLoggedIn, isOwner, listingController.renderEditForm);

module.exports = router;
