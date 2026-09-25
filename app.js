require("dotenv").config();

const path = require("path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

const sequelize = require("./config/database");

require("./models");

const dashboardRoutes = require("./routes/dashboard");
const authRoutes = require("./routes/auth");
const internshipRoutes = require("./routes/internships");
const companyRoutes = require("./routes/companies");
const interviewRoutes = require("./routes/interviews");
const offerRoutes = require("./routes/offers");
const adminRoutes = require("./routes/admin");

const app = express();

const PORT = process.env.PORT || 3000;


// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Static files
app.use(express.static(path.join(__dirname, "public")));


// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);


// Flash messages
app.use(flash());


// Passport
app.use(passport.initialize());
app.use(passport.session());


// Make user and flash messages available to EJS
app.use((req, res, next) => {
    res.locals.currentUser = req.user || null;
    res.locals.successMessages = req.flash("success");
    res.locals.errorMessages = req.flash("error");
    res.locals.currentPath = req.path;
    next();
});
app.get("/", (req, res) => {
    res.redirect("/login");
});


// Routes
app.use(authRoutes);

app.use(dashboardRoutes);

app.use(internshipRoutes);

app.use(companyRoutes);

app.use(interviewRoutes);

app.use(offerRoutes);

app.use(adminRoutes);


// Database connection and server
async function startServer() {

    try {

        await sequelize.authenticate();

        console.log("PostgreSQL connected successfully.");

        await sequelize.sync();

        console.log("Database tables synchronized successfully.");

        app.listen(PORT, () => {

            console.log(
                `Server running at http://localhost:${PORT}`
            );

        });

    } catch (error) {

        console.error(
            "Unable to connect to PostgreSQL:"
        );

        console.error(error.message);

    }

}

if (require.main === module) {
    startServer();
}

module.exports = app;