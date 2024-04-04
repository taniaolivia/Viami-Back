const db = require("../knex");
const userInterestService = require("../services/userInterestService");

// Get all interests with their users
exports.getAllUsersInterests = async (req, res) => {
    try {
        const data = await userInterestService.getAllUsersInterests();
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get all interests of a user by id
exports.getUserInterestsById = (req, res) => {
    let id = req.params.userId;

    db("user_interest")
        .select("*")
        .where({ userId: id })
        .join("user", "user.id", "=", "user_interest.userId")
        .join("interest", "interest.id", "=", "user_interest.interestId")
        .then(data => res.status(200).json({ "userInterests": data }))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({ message: "Server error" });
        });
}

// Get all users with the same interest by id

exports.getUserInterestsById = async (req, res) => {
    try {
        let id = req.params.interestId;

        const data = await userInterestService.getUserInterestsById(id);

        res.status(200).json({ "userInterests": data });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


// Add interest to user's data

exports.addUserInterest = async (req, res) => {

    let interest = req.body.interestId;
    let user = req.params.userId;

    try {
        const data = await userInterestService.addUserInterest(user, interest);
        res.status(200).json(data);
    } catch (error) {
        res.status(401).json({ message: "Invalid request" });
    }
};


// Delete an interest in user's data
exports.deleteUserInterest = async (req, res) => {
    let interest = req.body.interestId;
    let user = req.params.userId;

    try {
        const data = await userInterestService.deleteUserInterest(user, interest);
        res.status(200).json(data);
    } catch (error) {
        res.status(401).json({ message: "Invalid request" });
    }
};