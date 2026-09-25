const express = require("express");
const { Op } = require("sequelize");

const {
    Internship,
    Interview,
    Offer,
    Company
} = require("../models");

const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/dashboard", requireAuth, async (req, res, next) => {

    try {

        const userId = req.user.id;

        // ==========================================
        // APPLICATION STATISTICS
        // ==========================================

        const totalApplications = await Internship.count({
            where: {
                userId
            }
        });


        const inProgress = await Internship.count({
            where: {
                userId,

                status: {
                    [Op.in]: [
                        "Applied",
                        "Shortlisted",
                        "Interview Scheduled",
                        "Interview Completed"
                    ]
                }
            }
        });


        const rejected = await Internship.count({
            where: {
                userId,
                status: "Rejected"
            }
        });


        const accepted = await Internship.count({
            where: {
                userId,
                status: "Accepted"
            }
        });


        const interviews = await Interview.count({
            include: [
                {
                    model: Internship,
                    where: {
                        userId
                    },
                    attributes: []
                }
            ]
        });


        const offers = await Offer.count({
            include: [
                {
                    model: Internship,
                    where: {
                        userId
                    },
                    attributes: []
                }
            ]
        });


        // ==========================================
        // RECENT APPLICATIONS
        // ==========================================

        const recentApplications = await Internship.findAll({

            where: {
                userId
            },

            include: [
                {
                    model: Company,
                    attributes: [
                        "id",
                        "name"
                    ]
                }
            ],

            order: [
                ["applicationDate", "DESC"]
            ],

            limit: 5
        });


        // ==========================================
        // UPCOMING DEADLINES
        // ==========================================

        const upcomingDeadlines = await Internship.findAll({

            where: {

                userId,

                deadline: {
                    [Op.gte]: new Date()
                },

                status: {
                    [Op.notIn]: [
                        "Accepted",
                        "Rejected",
                        "Withdrawn"
                    ]
                }

            },

            include: [
                {
                    model: Company,
                    attributes: [
                        "id",
                        "name"
                    ]
                }
            ],

            order: [
                ["deadline", "ASC"]
            ],

            limit: 5
        });


        // ==========================================
        // RENDER DASHBOARD
        // ==========================================

        res.render("dashboard", {

            title: "Dashboard | InternTrack",

            totalApplications,

            inProgress,

            interviews,

            offers,

            accepted,

            rejected,

            recentApplications,

            upcomingDeadlines

        });

    } catch (error) {

        next(error);

    }

});


module.exports = router;