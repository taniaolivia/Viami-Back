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

// Get a travel compatible with user's search
exports.searchTravels = (req, res) => {
    let location = req.query.location;

    db("travel")
        .select("*")
        .where("location", location)
        .orderBy("name", "asc")
        .then(data => {
            res.status(200);
            res.json({message: `List of travels found`, travels: data});
        })
        .catch(error => {
            res.status(500);
            res.json({message: "Server error"});
        });   
}

// Get the number of participants of searched travel
exports.getDateLocationUsers = (req, res) => {
    let location = req.query.location;
    let date = req.query.date;

    db("date_location")
        .select("*")
        .where("location", location)
        .where("date", date)
        .orderBy("date", "asc")
        .then(data => {
            db("user_date_location")
                .select("*")
                .where("dateLocationId", data[0].id)
                .join("user", "user.id", "=", "user_date_location.userId")
                .join("date_location", "date_location.id", "=", "user_date_location.dateLocationId")
                .orderBy("user.firstName", "asc")
                .then(user => {
                    res.status(200);
                    res.json({userDateLocation: {
                        nbParticipant: user.length,
                        users: user
                    }});
                })
                .catch(error => {
                    res.status(401);
                    res.json({message: "There's no participant yet for this travel"});
                }); 
        })
        .catch(error => {
            db("date_location")
                .insert({
                    location: location,
                    date: date
                })
                .then(data => {
                    res.status(200);
                    res.json({message: "There's no participants yet for this travel"});
                })
                .catch(error => {
                    res.status(500);
                    res.json({message: "Server error"});
                });   
        });   
}

// Add user to a trip that user has searched
exports.joinTravel = (req, res) => {
    let location = req.body.location;
    let date = req.body.date;
    let userId = req.body.userId

    db("date_location")
        .select("*")
        .where("location", location)
        .andWhere("date", date)
        .orderBy("date", "asc")
        .then(data => {
            db("user_date_location")
                .select("*")
                .where("dateLocationId", data[0].id)
                .andWhere("userId", userId)
                .then(user => {
                    if(user.length === 0) {
                        db("user_date_location")
                        .insert({
                            userId: userId,
                            dateLocationId: data[0].id
                        })
                        .then(data => {
                            db("date_location")
                                .update({
                                    id: data[0].id,
                                    date: data[0].date,
                                    location: data[0].location,
                                    nbParticipant: data[0].nbParticipant == null ? 1 : data[0].nbParticipant + 1
                                }).
                                then(data => {
                                    res.status(200);
                                    res.json({message: "You've been added successfully to the trip!"});
                                })
                                .catch(error => {
                                    res.status(401);
                                    res.json({message: "Problem when adding user to a trip"});
                                }); 
                        })
                        .catch(error => {
                            res.status(401);
                            res.json({message: "Failed to add user to the trip"});
                        }); 
                    }
                    else {
                        res.status(200);
                        res.json({message: "You've joined this trip"});
                    }
                  
                })
                .catch(error => {
                    res.status(401);
                    res.json({message: "Failed to add user to the trip"});
                }); 
           
        })
        .catch(error => {
            res.status(500);
            res.json({message: "Server error"});
        });   
}

// Get all travels
exports.listAllTravels = (req, res) => {
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
    const {name, description, location} = req.body;

    if (!name || !description || !location) {
        return res.status(400).json({ message: "Please fill all the required fields ! (name, description and location)" });
    }

    db("travel")
        .insert({
            name: name,
            description: description,
            location: location,
            nbParticipant: 0 
        })
        .then(() => res.status(201).json({ message: "New travel is successfully saved." }))
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: "Error while saving the new travel." });
        });
}


