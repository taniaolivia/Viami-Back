
const db = require("../knex");
const travelImageService = require("../services/travelImageService");

// Get all images with their travel
exports.getAllTravelsImages = async (req, res) => {
    try {
        const data = await travelImageService.getAllTravelsImages();
        res.status(200).json({ data });
    } catch (error) {
        res.status(401).json({ message: "Server error" });
    }
};

// Get all images of a travel by id
exports.getTravelImagesById = async (req, res) => {
    try {
        const travelId = req.params.travelId;
        const data = await travelImageService.getTravelImagesById(travelId);
        res.status(200).json({ "travelImages": data });
    } catch (error) {
        res.status(401).json({ message: "Server error" });
    }
};

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
                   
                    res.json({message: "Invalid request"});
                })
        })
        .catch(error => {
            res.status(401);
           
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
                    res.json({message: "Invalid request"});
                })
        })
        .catch(error => {
            res.status(401);
            res.json({message: "Invalid request"});
        })
}