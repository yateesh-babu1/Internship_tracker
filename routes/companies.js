const express = require("express");

const {
    Company
} = require("../models");

const { requireAuth } = require("../middleware/auth");

const router = express.Router();


// ===============================
// VIEW ALL COMPANIES
// ===============================

router.get("/companies", requireAuth, async (req, res, next) => {
    try {

        const companies = await Company.findAll({
            order: [
                ["name", "ASC"]
            ]
        });

        res.render("companies/index", {
            title: "Companies | InternTrack",
            companies
        });

    } catch (error) {
        next(error);
    }
});


// ===============================
// ADD COMPANY PAGE
// ===============================

router.get("/companies/new", requireAuth, (req, res) => {

    res.render("companies/create", {
        title: "Add Company | InternTrack"
    });

});


// ===============================
// CREATE COMPANY
// ===============================

router.post("/companies", requireAuth, async (req, res, next) => {

    try {

        const {
            name,
            website,
            location,
            industry,
            description
        } = req.body;

        await Company.create({
            name,
            website: website || null,
            location: location || null,
            industry: industry || null,
            description: description || null
        });

        req.flash(
            "success",
            "Company added successfully."
        );

        res.redirect("/companies");

    } catch (error) {
        next(error);
    }

});


module.exports = router;