
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
exports.addImageToTravel = async (req, res) => {
    try {
        const { image } = req.body;
        const travelId = req.params.travelId;

        const imageData = await travelImageService.addImageToTravel(image, travelId);
        
        // If image was successfully added
        res.status(200).json({
            message: `Image is added to travel's data`,
            image: imageData
        });
    } catch (error) {
        res.status(401).json({ message: "Invalid request" });
    }
};

// Delete an image from travel's data
exports.deleteTravelImage = async (req, res) => {
    try {
        const imageId = req.body.imageId;
        const travelId = req.params.travelId;

        await travelImageService.deleteTravelImage(imageId, travelId);

        // If image was successfully deleted
        res.status(200).json({
            message: `Image is deleted from travel's data`,
        });
    } catch (error) {
        res.status(401).json({ message: "Invalid request" });
    }
};