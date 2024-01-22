const db = require("../knex");

// Get all activities with their travel
exports.getAllTravelsActivities = (req, res) => {
    db("travel_activity")
        .select([
            "travel_activity.id as id",
            "travel_activity.idActivity as idActivity",
            "travel_activity.idTravel as idTravel",
            "travel.name as name",
            "travel.description as travelDescription",
            "travel.location as location",
            "travel.nbParticipant as nbParticipant",
            "activity.name as activityName",
            "activity.imageName as imageName",
            "activity.location as activityLocation",
            "activity.isRecommended as isRecommended",
            "activity.nbParticipant as activityNbParticipant",
            "activity.url as activityUrl",
            "activity.telephone as activityTelephone",
            "activity.address as activityAddress",
            "activity.latitude as activityLatitude",
            "activity.longitude as activityLongitude",
            "activity.schedule as activitySchedule",
            "activity.language as activityLanguage",
            "activity.accessibility as accessibility"
        ])
        .join("travel", "travel.id", "=", "travel_activity.idTravel")
        .join("activity", "activity.id", "=", "travel_activity.idActivity")
        .then(data => res.status(200).json({data}))
        .catch(error => {
            res.status(401);
         
            res.json({message: "Server error"});
        });
}

// Get all activities of a travel by id
exports.getTravelActivitiesById = (req, res) => {
    let id = req.params.travelId;

    db("travel_activity")
    .select([
        "travel_activity.id as id",
        "travel_activity.idActivity as idActivity",
        "travel_activity.idTravel as idTravel",
        "travel.name as name",
        "travel.description as travelDescription",
        "travel.location as location",
        "travel.nbParticipant as nbParticipant",
        "activity.name as activityName",
        "activity.imageName as imageName",
        "activity.location as activityLocation",
        "activity.isRecommended as isRecommended",
        "activity.nbParticipant as activityNbParticipant",
        "activity.url as activityUrl",
        "activity.telephone as activityTelephone",
        "activity.address as activityAddress",
        "activity.latitude as activityLatitude",
        "activity.longitude as activityLongitude",
        "activity.schedule as activitySchedule",
        "activity.language as activityLanguage",
        "activity.accessibility as accessibility"
    ])
    .where({idTravel: id})
    .join("travel", "travel.id", "=", "travel_activity.idTravel")
    .join("activity", "activity.id", "=", "travel_activity.idActivity")
    .then(data => res.status(200).json({"travelActivities": data}))
    .catch(error => {
        res.status(401);
       
        res.json({message: "Server error"});
    });

}

// Add activity to travel's data
exports.addActivityToTravel = (req, res) => {
    let activity = req.body;
    let travelId = req.params.travelId;

    db("activity")
        .insert(activity)
        .then(data => {
            db("travel_activity")
                .insert({
                    idActivity: data[0],
                    idTravel: travelId
                })
                .then(travelActivity => {
                    db("travel")
                        .select("*")
                        .where({id: travelId})
                        .then(travelData => {
                            res.status(200).json({
                                message: `Activity is added to travel's data`,
                                travel: travelData,
                                activity: activity
                            }) 
                        })
                })
                .catch(error => {
                    res.status(401);
                    
                    res.json({message: "Invalid request"});
                })
        })
        .catch(error => {
            res.status(401);
           
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
            idActivity: activity,
            idTravel: travel
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
                  
                    res.json({message: "Invalid request"});
                })
        })
        .catch(error => {
            res.status(401);
           
            res.json({message: "Invalid request"});
        })
}