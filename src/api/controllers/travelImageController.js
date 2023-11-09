
const db = require("../knex");

// Get all images with their travel
exports.getAllTravelsImages = (req, res) => {
    db("travel_image")
        .select([
            "travel_image.id as id",
            "travel_image.idImage as idImage",
            "travel_image.idTravel as idTravel",
            "travel.name as name",
            "travel.description as travelDescription",
            "travel.location as location",
            "travel.nbPepInt as nbPepInt",
            "image.image as imageName",
            
        ])
        .join("travel", "travel.id", "=", "travel_image.idTravel")
        .join("image", "image.id", "=", "travel_image.idImage")
        .then(data => res.status(200).json({data}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });
}

// Get all activities of a travel by id
exports.getTravelImagesById = (req, res) => {
    let id = req.params.travelId;

    db("travel_image")
    .select([
        "travel_image.id as id",
            "travel_image.idImage as idImage",
            "travel_image.idTravel as idTravel",
            "travel.name as name",
            "travel.description as travelDescription",
            "travel.location as location",
            "travel.nbPepInt as nbPepInt",
            "image.image as imageName",
    ])
    .where({idTravel: id})
    .join("travel", "travel.id", "=", "travel_image.idTravel")
    .join("image", "image.id", "=", "travel_image.idImage")
    .then(data => res.status(200).json({"travelImages": data}))
    .catch(error => {
        res.status(401);
        console.log(error);
        res.json({message: "Server error"});
    });

}

// Add image to travel's data
exports.addImageToTravel = (req, res) => {
    const {image} = req.body;
    let travelId = req.params.travelId;

    db("image")
        .insert({
           image:image
        })
        .then(data => {
            db("travel_image")
                .insert({
                    idImage: data[0],
                    idTravel: travelId
                })
                .then(travelActivity => {
                    db("travel")
                        .select("*")
                        .where({id: travelId})
                        .then(travelData => {
                            res.status(200).json({
                                message: `Image is added to travel's data`,
                                travel: travelData,
                                image: {
                                    id: data[0],
                                    image:image
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

// Delete an image in travel's data
exports.deleteTravelImage = (req, res) => {
    let image = req.body.imageId;
    let travel = req.params.travelId;

    db("travel_activity")
        .delete("*")
        .where({
            idImage: image,
            idTravel: travel
        })
        .then(data => {
            db("image")
                .delete("*")
                .where({
                    id: image
                })
                .then(data => {
                    res.status(200).json({
                        message: `Image is deleted from travel's data`,
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