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
