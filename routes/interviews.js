const express = require("express");

const {
    Interview,
    Internship,
    Company
} = require("../models");

const { requireAuth } = require("../middleware/auth");

const router = express.Router();


// View interviews
router.get("/internships/:internshipId/interviews", requireAuth, async (req, res, next) => {
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

        const interviews = await Interview.findAll({
            where: {
                internshipId: internship.id
            },
            order: [["interviewDate", "DESC"]]
        });

        res.render("interviews/index", {
            title: "Interviews | InternTrack",
            internship,
            interviews
        });

    } catch (error) {
        next(error);
    }
});


// Add interview page
router.get("/internships/:internshipId/interviews/new", requireAuth, async (req, res, next) => {
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

        res.render("interviews/create", {
            title: "Add Interview | InternTrack",
            internship
        });

    } catch (error) {
        next(error);
    }
});


// Create interview
router.post("/internships/:internshipId/interviews", requireAuth, async (req, res, next) => {
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

        await Interview.create({
            internshipId: internship.id,
            interviewDate: req.body.interviewDate,
            interviewType: req.body.interviewType,
            interviewer: req.body.interviewer || null,
            meetingLink: req.body.meetingLink || null,
            notes: req.body.notes || null,
            result: req.body.result || null
        });

        await internship.update({
            status: "Interview Scheduled"
        });

        req.flash("success", "Interview added successfully.");

        res.redirect(`/internships/${internship.id}`);

    } catch (error) {
        next(error);
    }
});


module.exports = router;