const db = require("../knex");

// Get a list of comments
exports.listAllComments = (req, res) => {
    db("comment")
        .select("*")
        .then(data => res.status(200).json({"comments": data}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });
}

// Get a comment by id
exports.getCommentById = (req, res) => {
    let id = req.params.imageId;

    db("comment")
        .select("*")
        .where({id: id})
        .then(data => res.status(200).json({data}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });
}