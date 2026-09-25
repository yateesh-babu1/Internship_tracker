const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Internship = sequelize.define(
    "Internship",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        companyId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        role: {
            type: DataTypes.STRING,
            allowNull: false
        },

        location: {
            type: DataTypes.STRING,
            allowNull: true
        },

        workType: {
            type: DataTypes.ENUM("On-site", "Remote", "Hybrid"),
            allowNull: false,
            defaultValue: "On-site"
        },

        applicationDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        deadline: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        status: {
            type: DataTypes.ENUM(
                "Applied",
                "Shortlisted",
                "Interview Scheduled",
                "Interview Completed",
                "Offer Received",
                "Accepted",
                "Rejected",
                "Withdrawn"
            ),
            allowNull: false,
            defaultValue: "Applied"
        },

        jobUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },

        salary: {
            type: DataTypes.STRING,
            allowNull: true
        },

        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = Internship;