const express = require("express");

const {
    User,
    Internship,
    Company,
    Interview,
    Offer
} = require("../models");

const { requireAdmin } = require("../middleware/auth");

const router = express.Router();


// =====================================================
// ADMIN DASHBOARD
// =====================================================

router.get("/admin", requireAdmin, async (req, res, next) => {
    try {

        const totalStudents = await User.count({
            where: {
                role: "student"
            }
        });

        const totalApplications = await Internship.count();

        const totalCompanies = await Company.count();

        const totalInterviews = await Interview.count();

        const totalOffers = await Offer.count();


        // Application status counts

        const applied = await Internship.count({
            where: { status: "Applied" }
        });

        const shortlisted = await Internship.count({
            where: { status: "Shortlisted" }
        });

        const interviewScheduled = await Internship.count({
            where: { status: "Interview Scheduled" }
        });

        const interviewCompleted = await Internship.count({
            where: { status: "Interview Completed" }
        });

        const offerReceived = await Internship.count({
            where: { status: "Offer Received" }
        });

        const accepted = await Internship.count({
            where: { status: "Accepted" }
        });

        const rejected = await Internship.count({
            where: { status: "Rejected" }
        });

        const withdrawn = await Internship.count({
            where: { status: "Withdrawn" }
        });


        // Recent applications

        const recentApplications = await Internship.findAll({

            include: [

                {
                    model: User,
                    attributes: [
                        "id",
                        "firstName",
                        "lastName",
                        "email"
                    ]
                },

                {
                    model: Company,
                    attributes: [
                        "id",
                        "name"
                    ]
                }

            ],

            order: [
                ["createdAt", "DESC"]
            ],

            limit: 8

        });


        res.render("admin/dashboard", {

            title: "Admin Dashboard | InternTrack",

            totalStudents,
            totalApplications,
            totalCompanies,
            totalInterviews,
            totalOffers,

            applied,
            shortlisted,
            interviewScheduled,
            interviewCompleted,
            offerReceived,
            accepted,
            rejected,
            withdrawn,

            recentApplications

        });

    } catch (error) {

        next(error);

    }
});


// =====================================================
// ADMIN - STUDENTS
// =====================================================

router.get(
    "/admin/students",
    requireAdmin,
    async (req, res, next) => {

        try {

            const students = await User.findAll({

                where: {
                    role: "student"
                },

                attributes: [
                    "id",
                    "firstName",
                    "lastName",
                    "email",
                    "createdAt"
                ],

                include: [

                    {
                        model: Internship,
                        attributes: [
                            "id",
                            "status"
                        ]
                    }

                ],

                order: [
                    ["createdAt", "DESC"]
                ]

            });


            res.render("admin/students", {

                title: "Students | InternTrack",

                students

            });

        } catch (error) {

            next(error);

        }

    }
);


// =====================================================
// ADMIN - STUDENT DETAILS
// =====================================================

router.get(
    "/admin/students/:id",
    requireAdmin,
    async (req, res, next) => {

        try {

            const student = await User.findOne({

                where: {
                    id: req.params.id,
                    role: "student"
                },

                attributes: [
                    "id",
                    "firstName",
                    "lastName",
                    "email",
                    "createdAt"
                ],

                include: [

                    {
                        model: Internship,

                        include: [

                            {
                                model: Company,

                                attributes: [
                                    "id",
                                    "name"
                                ]
                            }

                        ]

                    }

                ]

            });


            if (!student) {

                req.flash(
                    "error",
                    "Student not found."
                );

                return res.redirect(
                    "/admin/students"
                );

            }


            res.render(
                "admin/student-details",
                {
                    title:
                        "Student Details | InternTrack",

                    student
                }
            );

        } catch (error) {

            next(error);

        }

    }
);


// =====================================================
// ADMIN - APPLICATIONS
// =====================================================

router.get(
    "/admin/applications",
    requireAdmin,
    async (req, res, next) => {

        try {

            const applications =
                await Internship.findAll({

                    include: [

                        {
                            model: User,

                            attributes: [
                                "id",
                                "firstName",
                                "lastName",
                                "email"
                            ]

                        },

                        {
                            model: Company,

                            attributes: [
                                "id",
                                "name"
                            ]

                        }

                    ],

                    order: [
                        ["createdAt", "DESC"]
                    ]

                });


            res.render(
                "admin/applications",
                {
                    title:
                        "Applications | InternTrack",

                    applications
                }
            );

        } catch (error) {

            next(error);

        }

    }
);


// =====================================================
// ADMIN - COMPANIES
// =====================================================

router.get(
    "/admin/companies",
    requireAdmin,
    async (req, res, next) => {

        try {

            const companies =
                await Company.findAll({

                    include: [

                        {
                            model: Internship,

                            attributes: [
                                "id"
                            ]

                        }

                    ],

                    order: [
                        ["name", "ASC"]
                    ]

                });


            res.render(
                "admin/companies",
                {
                    title:
                        "Companies | InternTrack",

                    companies
                }
            );

        } catch (error) {

            next(error);

        }

    }
);


module.exports = router;