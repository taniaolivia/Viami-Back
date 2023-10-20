const db = require("../knex");

// Get a list of interests
exports.listAllInterests = (req, res) => {
    db("interest")
        .select("*")
        .then(data => res.status(200).json({data}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });
}

// Get an interest by id
exports.getInterestById = (req, res) => {
    let id = req.params.interestId;

    db("interest")
        .select("*")
        .where({id: id})
        .then(data => res.status(200).json({data}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });
}
