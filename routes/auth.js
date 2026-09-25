const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const { User } = require("../models");

const router = express.Router();


// ======================================================
// PASSPORT LOCAL STRATEGY
// ======================================================

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        },

        async (email, password, done) => {
            try {

                const user = await User.findOne({
                    where: {
                        email: email.toLowerCase().trim()
                    }
                });

                if (!user) {
                    return done(null, false, {
                        message: "Invalid email or password."
                    });
                }

                const passwordMatch = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!passwordMatch) {
                    return done(null, false, {
                        message: "Invalid email or password."
                    });
                }

                return done(null, user);

            } catch (error) {
                return done(error);
            }
        }
    )
);


// ======================================================
// SERIALIZE USER
// ======================================================

passport.serializeUser((user, done) => {
    done(null, user.id);
});


// ======================================================
// DESERIALIZE USER
// ======================================================

passport.deserializeUser(async (id, done) => {
    try {

        const user = await User.findByPk(id);

        if (!user) {
            return done(null, false);
        }

        done(null, user);

    } catch (error) {
        done(error);
    }
});


// ======================================================
// STUDENT SIGNUP
// ======================================================

router.get("/signup", (req, res) => {

    res.render("auth/signup", {
        title: "Create Account | InternTrack"
    });

});


router.post("/signup", async (req, res) => {

    try {

        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword
        } = req.body;


        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword
        ) {

            req.flash(
                "error",
                "Please fill in all required fields."
            );

            return res.redirect("/signup");
        }


        if (password !== confirmPassword) {

            req.flash(
                "error",
                "Passwords do not match."
            );

            return res.redirect("/signup");
        }


        if (password.length < 6) {

            req.flash(
                "error",
                "Password must contain at least 6 characters."
            );

            return res.redirect("/signup");
        }


        const normalizedEmail =
            email.toLowerCase().trim();


        const existingUser = await User.findOne({
            where: {
                email: normalizedEmail
            }
        });


        if (existingUser) {

            req.flash(
                "error",
                "An account with this email already exists."
            );

            return res.redirect("/signup");
        }


        const hashedPassword =
            await bcrypt.hash(password, 12);


        await User.create({

            firstName: firstName.trim(),

            lastName: lastName.trim(),

            email: normalizedEmail,

            password: hashedPassword,

            // Public signup accounts are always students
            role: "student"

        });


        req.flash(
            "success",
            "Account created successfully. Please login."
        );


        res.redirect("/login");


    } catch (error) {

        console.error(error);

        req.flash(
            "error",
            "Unable to create account. Please try again."
        );

        res.redirect("/signup");
    }

});


// ======================================================
// STUDENT LOGIN PAGE
// ======================================================

router.get("/login", (req, res) => {

    res.render("auth/login", {
        title: "Student Login | InternTrack"
    });

});


// ======================================================
// STUDENT LOGIN
// ======================================================

router.post(
    "/login",

    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),

    (req, res) => {

        // Do not allow admin through student login
        if (req.user.role === "admin") {

            req.logout((error) => {

                if (error) {
                    return res.redirect("/login");
                }

                req.flash(
                    "error",
                    "Administrators must use the Admin Login."
                );

                return res.redirect("/admin/login");
            });

            return;
        }


        req.flash(
            "success",
            `Welcome back, ${req.user.firstName}!`
        );


        res.redirect("/dashboard");
    }
);


// ======================================================
// ADMIN LOGIN PAGE
// ======================================================

router.get("/admin/login", (req, res) => {

    res.render("auth/admin/login", {
        title: "Admin Login | InternTrack"
    });

});


// ======================================================
// ADMIN LOGIN
// ======================================================

router.post("/admin/login", (req, res, next) => {

    passport.authenticate(
        "local",
        (error, user, info) => {

            if (error) {
                return next(error);
            }


            if (!user) {

                req.flash(
                    "error",
                    info?.message || "Invalid email or password."
                );

                return res.redirect("/admin/login");
            }


            // Check admin role
            if (user.role !== "admin") {

                req.flash(
                    "error",
                    "This account does not have administrator access."
                );

                return res.redirect("/admin/login");
            }


            // Create login session
            req.logIn(user, (loginError) => {

                if (loginError) {
                    return next(loginError);
                }


                req.flash(
                    "success",
                    `Welcome back, ${user.firstName}!`
                );


                return res.redirect("/admin");
            });

        }
    )(req, res, next);
});


// ======================================================
// LOGOUT
// ======================================================

router.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.session.destroy((sessionError) => {
            if (sessionError) {
                return next(sessionError);
            }

            res.redirect("/login");
        });
    });
});


module.exports = router;