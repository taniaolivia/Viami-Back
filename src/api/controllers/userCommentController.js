const db = require("../knex");

// Get all comments with their users
exports.getAllUsersComments = (req, res) => {
    db("user_comment")
        .select("*")
        .join("user", "user.id", "=", "user_comment.commentId")
        .join("comment", "comment.id", "=", "user_comment.commentId")
        .then(data => res.status(200).json({data}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });
}

// Get all comments of a user by id
exports.getUserCommentsById = (req, res) => {
    let id = req.params.userId;

    db("user_comment")
        .select("*")
        .where({userId: id})
        .join("user", "user.id", "=", "user_comment.commentId")
        .join("comment", "comment.id", "=", "user_comment.commentId")
        .then(data => res.status(200).json({"userComments": data}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });
}
