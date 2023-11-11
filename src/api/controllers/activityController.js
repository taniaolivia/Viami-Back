const db = require("../knex");

exports.listAllActivities = (req, res) => {
    db("activity")
    .select("*")
    .orderBy("name", "asc")
    .then(data => res.status(200).json({"activity": data}))
    .catch(error => {
        res.status(401);
        res.json({message: "Server error"});
    });   
}

exports.getActivityById = (req, res) => {
    const id = req.params.activityId;

    db("activity")
        .select("*")
        .then(data => {
            res.status(200);
            res.json({data});
        })
        .catch(error => {
            res.status(401);
            res.json({message: "Activity not found"});
        });   
}

exports.saveActivity = (req,res) => {
    const {name, imageName,  location,  } = req.body;

    
    if (!name || !imageName || !location ) {
        return res.status(400).json({ message: "All fields are required." });
    }

    db("activity")
        .insert({
            name:name,
            imageName:imageName,
            location:location
            
        })
        .then(() => res.status(201).json({ message: "Activity record successfully saved." }))
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: "Error while saving the Activity record." });
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
            console.log(error);
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
            console.log(error);
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
            console.log(error);
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
            console.log(error);
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





