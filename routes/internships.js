const express = require("express");
const { Op } = require("sequelize");

const {
    Internship,
    Company
} = require("../models");

const { requireAuth } = require("../middleware/auth");

const router = express.Router();


// ======================================================
// VIEW ALL INTERNSHIPS + SEARCH + FILTER
// ======================================================

router.get(
    "/internships",
    requireAuth,
    async (req, res, next) => {

        try {

            const {
                search,
                status,
                workType,
                location,
                sort
            } = req.query;


            const where = {
                userId: req.user.id
            };


            // Search by role or location
            if (search) {

                where[Op.or] = [

                    {
                        role: {
                            [Op.iLike]: `%${search}%`
                        }
                    },

                    {
                        location: {
                            [Op.iLike]: `%${search}%`
                        }
                    }

                ];

            }


            // Status filter
            if (status) {

                where.status = status;

            }


            // Work type filter
            if (workType) {

                where.workType = workType;

            }


            // Location filter
            if (location) {

                where.location = {
                    [Op.iLike]: `%${location}%`
                };

            }


            // Sorting
            let order = [
                ["applicationDate", "DESC"]
            ];


            if (sort === "oldest") {

                order = [
                    ["applicationDate", "ASC"]
                ];

            }


            if (sort === "deadline") {

                order = [
                    ["deadline", "ASC"]
                ];

            }


            const internships = await Internship.findAll({

                where,

                include: [
                    {
                        model: Company,
                        attributes: [
                            "id",
                            "name",
                            "website",
                            "location",
                            "industry"
                        ]
                    }
                ],

                order

            });


            res.render(
                "internships/index",
                {
                    title: "My Internships | InternTrack",
                    internships,
                    filters: {
                        search: search || "",
                        status: status || "",
                        workType: workType || "",
                        location: location || "",
                        sort: sort || "newest"
                    }
                }
            );


        } catch (error) {

            next(error);

        }

    }
);


// ======================================================
// ADD INTERNSHIP PAGE
// ======================================================

router.get(
    "/internships/new",
    requireAuth,
    async (req, res, next) => {

        try {

            const companies = await Company.findAll({

                order: [
                    ["name", "ASC"]
                ]

            });


            res.render(
                "internships/create",
                {
                    title: "Add Internship | InternTrack",
                    companies
                }
            );


        } catch (error) {

            next(error);

        }

    }
);


// ======================================================
// CREATE INTERNSHIP
// ======================================================

router.post(
    "/internships",
    requireAuth,
    async (req, res, next) => {

        try {

            const {
                companyId,
                role,
                location,
                workType,
                applicationDate,
                deadline,
                status,
                jobUrl,
                salary,
                notes
            } = req.body;


            await Internship.create({

                userId: req.user.id,

                companyId,

                role,

                location,

                workType,

                applicationDate,

                deadline: deadline || null,

                status: status || "Applied",

                jobUrl: jobUrl || null,

                salary: salary || null,

                notes: notes || null

            });


            req.flash(
                "success",
                "Internship application added successfully."
            );


            res.redirect("/internships");


        } catch (error) {

            next(error);

        }

    }
);


// ======================================================
// VIEW INTERNSHIP DETAILS
// ======================================================

router.get(
    "/internships/:id",
    requireAuth,
    async (req, res, next) => {

        try {

            const internship =
                await Internship.findOne({

                    where: {

                        id: req.params.id,

                        userId: req.user.id

                    },

                    include: [
                        {
                            model: Company
                        }
                    ]

                });


            if (!internship) {

                req.flash(
                    "error",
                    "Internship application not found."
                );

                return res.redirect(
                    "/internships"
                );

            }


            res.render(
                "internships/show",
                {
                    title:
                        "Internship Details | InternTrack",

                    internship
                }
            );


        } catch (error) {

            next(error);

        }

    }
);


// ======================================================
// EDIT INTERNSHIP PAGE
// ======================================================

router.get(
    "/internships/:id/edit",
    requireAuth,
    async (req, res, next) => {

        try {

            const internship =
                await Internship.findOne({

                    where: {

                        id: req.params.id,

                        userId: req.user.id

                    },

                    include: [
                        {
                            model: Company
                        }
                    ]

                });


            if (!internship) {

                req.flash(
                    "error",
                    "Internship application not found."
                );

                return res.redirect(
                    "/internships"
                );

            }


            const companies =
                await Company.findAll({

                    order: [
                        ["name", "ASC"]
                    ]

                });


            res.render(
                "internships/edit",
                {
                    title:
                        "Edit Internship | InternTrack",

                    internship,

                    companies
                }
            );


        } catch (error) {

            next(error);

        }

    }
);


// ======================================================
// UPDATE INTERNSHIP
// ======================================================

router.post(
    "/internships/:id",
    requireAuth,
    async (req, res, next) => {

        try {

            const internship =
                await Internship.findOne({

                    where: {

                        id: req.params.id,

                        userId: req.user.id

                    }

                });


            if (!internship) {

                req.flash(
                    "error",
                    "Internship application not found."
                );

                return res.redirect(
                    "/internships"
                );

            }


            const {
                companyId,
                role,
                location,
                workType,
                applicationDate,
                deadline,
                status,
                jobUrl,
                salary,
                notes
            } = req.body;


            await internship.update({

                companyId,

                role,

                location,

                workType,

                applicationDate,

                deadline: deadline || null,

                status,

                jobUrl: jobUrl || null,

                salary: salary || null,

                notes: notes || null

            });


            req.flash(
                "success",
                "Internship application updated successfully."
            );


            res.redirect(
                `/internships/${internship.id}`
            );


        } catch (error) {

            next(error);

        }

    }
);


// ======================================================
// DELETE INTERNSHIP
// ======================================================

router.post(
    "/internships/:id/delete",
    requireAuth,
    async (req, res, next) => {

        try {

            const internship =
                await Internship.findOne({

                    where: {

                        id: req.params.id,

                        userId: req.user.id

                    }

                });


            if (!internship) {

                req.flash(
                    "error",
                    "Internship application not found."
                );

                return res.redirect(
                    "/internships"
                );

            }


            await internship.destroy();


            req.flash(
                "success",
                "Internship application deleted successfully."
            );


            res.redirect(
                "/internships"
            );


        } catch (error) {

            next(error);

        }

    }
);


module.exports = router;