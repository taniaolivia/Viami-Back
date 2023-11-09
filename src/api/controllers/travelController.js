const db = require("../knex");

// Get the travel information
exports.getTravelById = (req, res) => {
    const id = req.params.travelId;

    db("travel")
        .select("*")
        .where("id", id)
        .then(data => {
            res.status(200);
            res.json({message: `Travel found`, travel: data});
        })
        .catch(error => {
            res.status(500);
            res.json({message: "Server error"});
        });   
}

// Get list of travels compatible with searched demand
exports.searchTravels = (req, res) => {
    const location = req.query.location;

    db("travel")
        .select("*")
        .where("location", location)
        .then(data => {
            res.status(200);
            res.json({message: `List of travels found`, travels: data});
        })
        .catch(error => {
            res.status(500);
            res.json({message: "Server error"});
        });   
}

// Get all travels
exports.listAllTravel = (req, res) => {
    db("travel")
        .select("*")
        .orderBy("name", "asc")
        .then(data => res.status(200).json({"travels": data}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });   
}

// Add new travel
exports.saveTravel = (req,res) => {
    const {name, description, location, nbPepInt } = req.body;

    if (!name || !description || !location) {
        return res.status(400).json({ message: "Please fill all the required fields ! (name, description and location)" });
    }

    db("travel")
        .insert({
            name: name,
            description: description,
            location: location,
            nbPepInt: 0 
        })
        .then(() => res.status(201).json({ message: "New travel is successfully saved." }))
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: "Error while saving the new travel." });
        });
}

// Get all recommended travels
exports.listRecommendedTravel = (req, res) => {
    db("travel")
        .select("*")
        .where({ isRecommended: 1 })
        .orderBy("name", "asc")
        .then(data => res.status(200).json({'travels' : data }))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({ message: "Server error" });
        });
}

// Get all popular travels
exports.listPopularTravels = (req, res) => {
    db("travel")
        .select("*")
        .orderBy("nbPepInt", "desc")
        .orderBy("name", "asc")
        .then(data => res.status(200).json({'travels' : data }))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({ message: "Server error" });
        });
}

// Get only top five popular travels
exports.getTopFivePopularTravels = (req, res) => {
    db("travel")
        .select("*")
        .orderBy("nbPepInt", "desc")
        .orderBy("name", "asc")
        .limit(5)
        .offset(0)
        .then(data => res.status(200).json({'travels' : data }))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({ message: "Server error" });
        });
}

// Get the top five recommended travels
exports.getTopFiveRecommendedTravels = (req, res) => {
    db("travel")
        .select("*")
        .where("isRecommended", 1)
        .orderBy("name", "asc")
        .limit(5)
        .offset(0)
        .then(data => res.status(200).json({"travels": data}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });   
}

//Get the recommended travel by id 
exports.getRecommendedTravelById = (req, res) => {
    const id = req.params.travelId;

    db("travel")
        .select("*")
        .where("id", id)
        .then(data => {
            if (data && data.length > 0) {
                const travelData = data[0];
                if (travelData.isRecommended == 1) {
                    res.status(200);
                    res.json({message: `Travel found`, travel: travelData});
                } else {
                    res.status(403);
                    res.json({message: "Travel not recommended"});
                }
            } else {
                res.status(404);
                res.json({message: "Travel not found"});
            }
        })
        .catch(error => {
            res.status(500);
            res.json({message: "Server error"});
        });
};


