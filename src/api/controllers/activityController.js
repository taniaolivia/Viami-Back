const db = require("../knex");
const EARTH_RADIUS = 6371; // Earth's radius in kilometers
const  activityService = require('../services/activityService');


exports.listAllActivities = (req, res) => {
    activityService.fetchAllActivities()
        .then(data => res.status(200).json({"activities": data}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });   
}

exports.getActivityById = (req, res) => {
    const id = req.params.activityId;

    activityService.findActivityById(id)
        .then(data => {
            if (data.length) {
                res.status(200).json({message: `Activity found`, data});
            } else {
                res.status(404).json({message: "Activity not found"});
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({message: "Server error"});
        });
}

exports.saveActivity = (req, res) => {
    const activity = req.body;

    activityService.saveActivity(activity)
        .then(() => {
            console.log("Activity successfully saved");
            res.status(201).json({ message: "Activity is successfully saved."});
        })
        .catch(error => {
            console.error("Error saving activity:", error); // Log en cas d'erreur
            
            console.log("Setting status to 500"); // Log avant de définir le statut
            res.status(500);
            
            console.log("Sending JSON response"); // Log avant d'envoyer la réponse JSON
            res.json({ message: "Invalid request"});
        });
};


// Get all recommended activities
exports.listRecommendedActivities = (req, res) => {
    activityService.findRecommendedActivities()
        .then(data => res.status(200).json({'activities' : data}))
        .catch(error => {
            res.status(401);
            
            res.json({ message: "Server error" });
        });
}

// Get all popular activities
exports.listPopularActivities = (req, res) => {
    activityService.findPopularActivities()
        .then(data => res.status(200).json({'activities' : data}))
        .catch(error => {
            res.status(401);
            
            res.json({ message: "Server error" });
        });
}

// Get only top five popular activities
exports.getTopFivePopularActivities = (req, res) => {
    activityService.findTopFivePopularActivities()
        .then(data => res.status(200).json({'activities' : data }))
        .catch(error => {
            res.status(401);
           
            res.json({ message: "Server error" });
        });
}

// Get the top five recommended activities
exports.getTopFiveRecommendedActivities = (req, res) => {
    activityService.findTopFiveRecommendedActivities()
        .then(data => res.status(200).json({"activities": data}))
        .catch(error => {
            res.status(401);
            res.json({message: "Server error"});
        });   
}

//Get the recommended activity by id 
exports.getRecommendedActivityById = (req, res) => {
    const id = req.params.activityId;

    activityService.findRecommendedActivityById(id)
        .then(data => {
            const acitivityData = data[0];

            if (acitivityData.isRecommended == 1) {
                res.status(200);
                res.json({message: `Activity found`, activity: acitivityData});
            } else {
                res.status(403);
                res.json({message: "Activity not recommended"});
            }
        })
        .catch(error => {
            res.status(404);
            res.json({message: "Activity not found"});
        });
};

// Update note activity
exports.updateNoteActivity=(req,res) => {
    const id = req.params.activityId;
    const newNote = req.body.note;

    activityService.updateActivityNote(id, newNote)
      .then(data => {
        res.status(200);
        res.json({message: `Activity note is updated successfully`});
    })
    .catch(error => {
        res.status(401);
        res.json({message: "Activity not found"});
    });
}

// Get the nearest activity by user's position
exports.getAllActivitiesByUserPosition = async (req, res) => {
    const userLat = req.query.lat;
    const userLon = req.query.lon;

    try {
        const nearbyActivities = await activityService.getAllActivitiesByUserPosition(userLat, userLon);
        if (nearbyActivities.length > 0) {
            res.status(200).json({ message: "Nearby activities found", activities: nearbyActivities });
        } else {
            res.status(404).json({ message: "No nearby activities found" });
        }
    } catch (error) {
        res.status(404).json({ message: "Activity not found" });
    }
};





