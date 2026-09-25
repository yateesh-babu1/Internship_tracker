const express = require("express");

const {
    Offer,
    Internship,
    Company
} = require("../models");

const { requireAuth } = require("../middleware/auth");

const router = express.Router();


// View offers
router.get(
    "/internships/:internshipId/offers",
    requireAuth,
    async (req, res, next) => {
        try {
            const internship = await Internship.findOne({
                where: {
                    id: req.params.internshipId,
                    userId: req.user.id
                },
                include: [Company]
            });

            if (!internship) {
                req.flash("error", "Internship not found.");
                return res.redirect("/internships");
            }

            const offers = await Offer.findAll({
                where: {
                    internshipId: internship.id
                },
                order: [["offerDate", "DESC"]]
            });

            res.render("offers/index", {
                title: "Offers | InternTrack",
                internship,
                offers
            });

        } catch (error) {
            next(error);
        }
    }
);


// Add offer page
router.get(
    "/internships/:internshipId/offers/new",
    requireAuth,
    async (req, res, next) => {
        try {
            const internship = await Internship.findOne({
                where: {
                    id: req.params.internshipId,
                    userId: req.user.id
                },
                include: [Company]
            });

            if (!internship) {
                req.flash("error", "Internship not found.");
                return res.redirect("/internships");
            }

            res.render("offers/create", {
                title: "Add Offer | InternTrack",
                internship
            });

        } catch (error) {
            next(error);
        }
    }
);


// Create offer
router.post(
    "/internships/:internshipId/offers",
    requireAuth,
    async (req, res, next) => {
        try {
            const internship = await Internship.findOne({
                where: {
                    id: req.params.internshipId,
                    userId: req.user.id
                }
            });

            if (!internship) {
                req.flash("error", "Internship not found.");
                return res.redirect("/internships");
            }

            await Offer.create({
                internshipId: internship.id,
                offerDate: req.body.offerDate,
                joiningDate: req.body.joiningDate || null,
                salary: req.body.salary || null,
                offerStatus: req.body.offerStatus || "Pending",
                notes: req.body.notes || null
            });

            await internship.update({
                status: "Offer Received"
            });

            req.flash(
                "success",
                "Offer added successfully."
            );

            res.redirect(`/internships/${internship.id}`);

        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;