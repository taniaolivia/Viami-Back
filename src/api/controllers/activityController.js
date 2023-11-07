const db = require("../knex");

exports.listAllActivities = (req, res) => {
    db(" activity")
    .select("*")
    .orderBy("name", "asc")
    .then(data => res.status(200).json({data}))
    .catch(error => {
        res.status(401);
        console.log(error);
        res.json({message: "Server error"});
    });   
}