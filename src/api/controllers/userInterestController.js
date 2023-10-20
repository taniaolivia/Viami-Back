const db = require("../knex");

// Get all interests with their users
exports.getAllUsersInterests = (req, res) => {
    db("user_interest")
        .select("*")
        .join("user", "user.id", "=", "user_interest.userId")
        .join("interest", "interest.id", "=", "user_interest.interestId")
        .then(data => res.status(200).json({data}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });
}

// Get all interests of a user by id
exports.getUserInterestsById = (req, res) => {
    let id = req.params.userId;

    db("user_interest")
        .select("*")
        .where({userId: id})
        .join("user", "user.id", "=", "user_interest.userId")
        .join("interest", "interest.id", "=", "user_interest.interestId")
        .then(data => res.status(200).json({data}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });
}

// Get all users with the same interest by id
exports.getInterestUsersById = (req, res) => {
    let id = req.params.interestId;

    db("user_interest")
        .select("*")
        .where({interestId: id})
        .join("user", "user.id", "=", "user_interest.userId")
        .join("interest", "interest.id", "=", "user_interest.interestId")
        .then(data =>
             res.status(200).json({data}
        ))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });
}