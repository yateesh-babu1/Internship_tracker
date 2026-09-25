function requireAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    req.flash("error", "Please login to continue.");
    return res.redirect("/login");
}

function requireAdmin(req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash("error", "Please login to continue.");
        return res.redirect("/login");
    }

    if (req.user.role !== "admin") {
        req.flash("error", "You are not authorized to access this page.");
        return res.redirect("/dashboard");
    }

    next();
}

module.exports = {
    requireAuth,
    requireAdmin
};