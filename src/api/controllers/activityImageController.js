
const db = require("../knex");
const  activityImageService = require('../services/activityImageService');

// Get all images with their activities
exports.getAllActivitiesImages = async (req, res) => {
    try {
        const data = await activityImageService.getAllActivitiesImages();
        res.status(200).json({ data });
    } catch (error) {
        res.status(401).json({ message: "Server error" });
    }
};

// Get all images of an activity by id
exports.getActivityImagesById = async (req, res) => {
    try {
        const activityId = req.params.activityId;
        const data = await activityImageService.getActivityImagesById(activityId);
        res.status(200).json({"activityImages": data});
    } catch (error) {
        res.status(401).json({ message: "Server error" });
    }
};

// Add image to activity's data
exports.addImageToActivity = async (req, res) => {
    try {
        const image = req.body.image;
        const activityId = req.params.activityId;
        const result = await activityImageService.addImageToActivity(image, activityId);
        res.status(200).json({
            message: `Image is added to activity's data`,
            activity: result.activityData,
            image: {
                id: result.imageId,
                image: image
            }
        });
    } catch (error) {
        res.status(401).json({ message: "Invalid request" });
    }
};

// Delete an image in activity's data
exports.deleteActivityImage = async (req, res) => {
    try {
        const imageId = req.body.imageId;
        const activityId = req.params.activityId;
        await activityImageService.deleteActivityImage(imageId, activityId);
        res.status(200).json({ message: `Image is deleted from activity's data` });
    } catch (error) {
        res.status(401).json({ message: 'Invalid request' });
    }
};