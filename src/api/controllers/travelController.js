const db = require("../knex");



// Get the travel information
exports.getTravelById = (req, res) => {
    const id = req.params.travelId;

    db("travel")
        .select("*")
        .then(datas => {
            datas.map((data) => {
                 if(id === data.id) {
                    res.status(200);
                    res.json({message: `Travel found`, travel: data});
                }
            })
        })
        .catch(error => {
            res.status(500);
            res.json({message: "Server error"});
        });   
}