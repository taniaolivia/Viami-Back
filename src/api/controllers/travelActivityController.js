const travelActivityService = require('../services/travelActivityService');

// Get all activities with their travel
exports.getAllTravelsActivities = async (req, res) => {
    try {
        const data = await travelActivityService.getAllTravelsActivities();
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all activities of a travel by id
exports.getTravelActivitiesById = async (req, res) => {
    const travelId = req.params.travelId;
    try {
        const data = await travelActivityService.getTravelActivitiesById(travelId);
        res.status(200).json({ travelActivities: data });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Add activity to travel's data
exports.addActivityToTravel = async (req, res) => {
    const activity = req.body;
    const travelId = req.params.travelId;
    try {
        const response = await travelActivityService.addActivityToTravel(activity, travelId);
        res.status(200).json(response);
    } catch (error) {
        res.status(401).json({ message: 'Invalid request' });
    }
};

// Delete an activity in travel's data
exports.deleteTravelActivity = async (req, res) => {
    const activityId = req.body.activityId;
    const travelId = req.params.travelId;
    try {
        const response = await travelActivityService.deleteTravelActivity(activityId, travelId);
        res.status(200).json(response);
    } catch (error) {
        res.status(401).json({ message: 'Invalid request' });
    }
};