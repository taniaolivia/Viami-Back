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

// Get all activities of a travel by id
exports.getTravelActivitiesById = (req, res) => {
    let id = req.params.travelId;

    db("travel_activity")
        .select("*")
        .where({travelId: id})
        .join("travel", "travel.id", "=", "travel_activity.travelId")
        .join("activity", "activity.id", "=", "travel_activity.activityId")
        .then(data => res.status(200).json({"travelActivities": data}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });
}

// Add activity to travel's data
exports.addActivityToTravel = (req, res) => {
    const {name, imageName, location} = req.body;
    let newActivity = req.body.activity;
    let travelId = req.params.travelId;

    db("activity")
        .insert({
            name:name,
            imageName:imageName,
            location:location
        })
        .then(data => {
            db("travel_activity")
                .insert({
                    activityId: data[0],
                    travelId: travelId
                })
                .then(travelActivity => {
                    db("travel")
                        .select("*")
                        .where({id: travelId})
                        .then(travelData => {
                            res.status(200).json({
                                message: `Activity is added to travel's data`,
                                travel: travelData,
                                activity: {
                                    id: data[0],
                                    name:name,
                                    imageName:imageName,
                                    location:location
                                }
                            }) 
                        })
                })
                .catch(error => {
                    res.status(401);
                    console.log(error);
                    res.json({message: "Invalid request"});
                })
        })
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Invalid request"});
        });
}

// Delete an activity in travel's data
exports.deleteTravelActivity = (req, res) => {
    let activity = req.body.activityId;
    let travel = req.params.travelId;

    db("travel_activity")
        .delete("*")
        .where({
            activityId: activity,
            travelId: travel
        })
        .then(data => {
            db("activity")
                .delete("*")
                .where({
                    id: activity
                })
                .then(data => {
                    res.status(200).json({
                        message: `Activity  is deleted from travel's data`,
                    });
                })
                .catch(error => {
                    res.status(401);
                    console.log(error);
                    res.json({message: "Invalid request"});
                })
        })
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Invalid request"});
        })
}