const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/users");

// Register routes
router.route("/signup")
    .get(userController.renderRegisterForm)
    .post(userController.registerUser);

// Login routes
router.route("/login")
    .get(userController.renderLoginForm)
    .post(passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login"
    }), userController.loginUser);

// Logout route
router.get("/logout", userController.logoutUser);

module.exports = router;
