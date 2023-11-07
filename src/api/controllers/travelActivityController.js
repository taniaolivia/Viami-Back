const db = require("../knex");

// Get all activities with their travel
exports.getAllTravelsActivities = (req, res) => {
    db("travel_activity")
        .select("*")
        .join("travel", "travel.id", "=", "travel_activity.idTravel")
        .join("activity", "activity.id", "=", "travel_activity.idActivity")
        .then(data => res.status(200).json({data}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });
}