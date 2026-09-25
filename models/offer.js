const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Offer = sequelize.define(
    "Offer",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        internshipId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },

        offerDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        joiningDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        salary: {
            type: DataTypes.STRING,
            allowNull: true
        },

        offerStatus: {
            type: DataTypes.ENUM(
                "Pending",
                "Accepted",
                "Declined"
            ),
            allowNull: false,
            defaultValue: "Pending"
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

module.exports = Offer;