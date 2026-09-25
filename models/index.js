const User = require("./User");
const Company = require("./company");
const Internship = require("./Internship");
const Interview = require("./Interview");
const Offer = require("./offer");

// User and Internship relationship
User.hasMany(Internship, {
    foreignKey: "userId",
    onDelete: "CASCADE"
});

Internship.belongsTo(User, {
    foreignKey: "userId"
});

// Company and Internship relationship
Company.hasMany(Internship, {
    foreignKey: "companyId",
    onDelete: "CASCADE"
});

Internship.belongsTo(Company, {
    foreignKey: "companyId"
});

// Internship and Interview relationship
Internship.hasMany(Interview, {
    foreignKey: "internshipId",
    onDelete: "CASCADE"
});

Interview.belongsTo(Internship, {
    foreignKey: "internshipId"
});

// Internship and Offer relationship
Internship.hasOne(Offer, {
    foreignKey: "internshipId",
    onDelete: "CASCADE"
});

Offer.belongsTo(Internship, {
    foreignKey: "internshipId"
});

module.exports = {
    User,
    Company,
    Internship,
    Interview,
    Offer
};