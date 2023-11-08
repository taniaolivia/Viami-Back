const db = require("../knex");
const { uuid } = require('uuidv4');



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


//get all travel
exports.listAllTravel = (req, res) => {
    db("travel")
    .select("*")
    .orderBy("name", "asc")
    .then(data => res.status(200).json({data}))
    .catch(error => {
        res.status(401);
        console.log(error);
        res.json({message: "Server error"});
    });   
}

exports.saveTravel = (req,res) => {
    const {name, description, location, nbPepInt } = req.body;

    
    if (!name || !description || !location || !nbPepInt) {
        return res.status(400).json({ message: "All fields are required." });
    }

    db("travel")
        .insert({
            name:name,
            description:description,
            location:location,
            nbPepInt: nbPepInt  
        })
        .then(() => res.status(201).json({ message: "Travel record successfully saved." }))
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: "Error while saving the travel record." });
        });


}


// Get all recommended travels
exports.listRecommendedTravel = (req, res) => {
    db("travel")
        .select("*")
        .where({ isRecommended: 1 })  // Filtrer les voyages recommandés
        .orderBy("name", "asc")
        .then(data => res.status(200).json({'travels' : data }))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({ message: "Server error" });
        });
}
