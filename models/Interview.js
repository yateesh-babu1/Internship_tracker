const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Interview = sequelize.define(
    "Interview",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        internshipId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        interviewDate: {
            type: DataTypes.DATE,
            allowNull: false
        },

        interviewType: {
            type: DataTypes.ENUM(
                "Online",
                "Offline",
                "Phone",
                "Technical",
                "HR"
            ),
            allowNull: false
        },

        interviewer: {
            type: DataTypes.STRING,
            allowNull: true
        },

        meetingLink: {
            type: DataTypes.STRING,
            allowNull: true
        },

        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        result: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = Interview;