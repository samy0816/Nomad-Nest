
if(process.env.NODE_ENV !="production")
{
require('dotenv').config();
}// app.js

const express = require("express");
const engine = require('ejs-mate');
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const ExpressError = require("./utils/ExpressError");

const listingsRoutes = require("./routes/listings");
const reviewsRoutes = require("./routes/reviews");
const usersRoutes = require("./routes/users");

const app = express();

// View engine
app.engine('ejs', engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add JSON parsing middleware
app.use(methodOverride('_method'));

// Session config
const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};
app.use(session(sessionOptions));
app.use(flash());

// Passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Locals
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    res.locals.search = req.query.search;
    res.locals.minPrice = req.query.minPrice;
    res.locals.maxPrice = req.query.maxPrice;
    next();
});

// Routes
app.use("/", usersRoutes);
app.use("/listings", listingsRoutes);
app.use("/listings/:id/reviews", reviewsRoutes);

// API routes
const listingController = require("./controllers/listings");
const WrapAsync = require("./utils/WrapAsync");
app.post("/api/generate-itinerary", (req, res, next) => {
    console.log('API route hit:', req.method, req.path);
    console.log('Request body:', req.body);
    next();
}, WrapAsync(listingController.generateItinerary));

// Root route
app.get("/", (req, res) => {
    res.send("Serving working well!");
});

// 404 handler
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

// Global error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    res.status(statusCode).render("listings/error", { err });
});

// DB connect
const dbUrl = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/Listings";
async function connectDB() {
    try {
        await mongoose.connect(dbUrl);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}
connectDB();

module.exports = app;
