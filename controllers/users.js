const User = require("../models/User");

module.exports.renderRegisterForm = (req, res) => {
    res.render("users/signup");
};

module.exports.registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", `Welcome ${req.body.username}!`);
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
};

module.exports.loginUser = (req, res) => {
    req.flash("success", `Welcome back ${req.body.username}!` );
    const redirectUrl = req.session.returnTo || "/listings";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
    req.logout(() => {
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });
};
