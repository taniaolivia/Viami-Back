const db = require("../knex");
const EARTH_RADIUS = 6371; // Earth's radius in kilometers

exports.listAllActivities = (req, res) => {
    db("activity")
        .select("*")
        .orderBy("name", "asc")
        .then(data => res.status(200).json({"activities": data}))
        .catch(error => {
            res.status(401);
            res.json({message: "Server error"});
        });   
}

exports.getActivityById = (req, res) => {
    const id = req.params.activityId;

    db("activity")
        .select("*")
        .where("id", id)
        .then(data => {
            res.status(200);
            res.json({message: `Activity found`, data});
        })
        .catch(error => {
            res.status(401);
            res.json({message: "Activity not found"});
        });   
}

exports.saveActivity = (req,res) => {
    const activity = req.body;

    db("activity")
        .insert(activity)
        .then(() => res.status(201).json({ message: "Activity is successfully saved."}))
        .catch(error => {
            
            res.status(500).json({ message: "Invalid request"});
        });
}

// Get all recommended activities
exports.listRecommendedActivities = (req, res) => {
    db("activity")
        .select("*")
        .where("isRecommended", 1)
        .orderBy("name", "asc")
        .then(data => res.status(200).json({'activities' : data}))
        .catch(error => {
            res.status(401);
            
            res.json({ message: "Server error" });
        });
}

// Get all popular activities
exports.listPopularActivities = (req, res) => {
    db("activity")
        .select("*")
        .orderBy("nbParticipant", "desc")
        .orderBy("name", "asc")
        .then(data => res.status(200).json({'activities' : data}))
        .catch(error => {
            res.status(401);
            
            res.json({ message: "Server error" });
        });
}

// Get only top five popular activities
exports.getTopFivePopularActivities = (req, res) => {
    db("activity")
        .select("*")
        .orderBy("nbParticipant", "desc")
        .orderBy("name", "asc")
        .limit(5)
        .offset(0)
        .then(data => res.status(200).json({'activities' : data }))
        .catch(error => {
            res.status(401);
           
            res.json({ message: "Server error" });
        });
}

// Get the top five recommended activities
exports.getTopFiveRecommendedActivities = (req, res) => {
    db("activity")
        .select("*")
        .where("isRecommended", 1)
        .orderBy("name", "asc")
        .limit(5)
        .offset(0)
        .then(data => res.status(200).json({"activities": data}))
        .catch(error => {
            res.status(401);
            res.json({message: "Server error"});
        });   
}

//Get the recommended activity by id 
exports.getRecommendedActivityById = (req, res) => {
    const id = req.params.activityId;

    db("activity")
        .select("*")
        .where("id", id)
        .then(data => {
            const acitivityData = data[0];

            if (acitivityData.isRecommended == 1) {
                res.status(200);
                res.json({message: `Activity found`, acitivity: acitivityData});
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

    db("activity")
      .update({ note: newNote })
      .where('id', id)
      .then(data => {
        res.status(200);
        res.json({message: `Activity note is updated successfully'`});
    })
    .catch(error => {
        res.status(401);
        res.json({message: "Activity not found"});
    });
}

// Function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = EARTH_RADIUS * c;

    return distance;
}

// Get the nearest activity by user's position
exports.getAllActivitiesByUserPosition = (req, res) => {
    const userLat = req.query.lat;
    const userLon = req.query.lon;

    db("activity")
        .select("*")
        .then(activities => {
            const nearbyActivities = activities.filter(activity => {
                const distance = calculateDistance(
                    userLat,
                    userLon,
                    activity.latitude,
                    activity.longitude
                );

                return distance <= 50;
            });

            if (nearbyActivities.length > 0) {
                res.status(200).json({ message: "Nearby activities found", activities: nearbyActivities });
            } else {
                res.status(404).json({ message: "No nearby activities found" });
            }
        })
        .catch(error => {
            res.status(404);
            res.json({message: "Activity not found"});
        });
};




