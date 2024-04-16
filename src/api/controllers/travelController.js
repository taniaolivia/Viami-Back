const db = require("../knex");
const travelService = require('../services/travelService');

// Get the travel information
exports.getTravelById = async (req, res) => {
    try {
        const id = req.params.travelId;
        const data = await travelService.getTravelById(id);
        if (!data) {
            return res.status(404).json({ message: 'Travel not found' });
        }
        return res.status(200).json({ message: 'Travel found', travel: data });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get a travel compatible with user's search
exports.searchTravels = async (req, res) => {
    try {
        let location = req.query.location;
        const data = await travelService.searchTravels(location);
        return res.status(200).json({ message: 'List of travels found', travels: data });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get the number of participants of searched travel
exports.getDateLocationUsers = async (req, res) => {
    try {
        const location = req.query.location;
        const date = req.query.date;

        const data = await dateLocationService.getDateLocationUsers(location, date);

        res.status(200).json({ userDateLocation: data });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

// Add user to a trip that user has searched
exports.joinTravel = (req, res) => {
    let location = req.body.location;
    let date = req.body.date;
    let userId = req.body.userId

    db("date_location")
    .select("*")
    .where("location", location)
    .where("date", date)
    .orderBy("date", "asc")
    .then(data => {
        console.log("data", data)

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
        console.log(error)
        res.status(500);
        res.json({message: "Server error"});
    }); 
};

// Get all travels
exports.listAllTravels = async (req, res) => {
    try {
        const data = await travelService.listAllTravels();
        res.status(200).json({ "travels": data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add new travel
exports.saveTravel = async (req, res) => {
    try {
        const { name, description, location } = req.body;
        
        if (!name || !description || !location) {
            return res.status(400).json({ message: "Please fill all the required fields ! (name, description and location)" });
        }

        const response = await travelService.saveNewTravel(name, description, location);
        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


