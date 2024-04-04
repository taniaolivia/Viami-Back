const db = require("../knex");
const themeActivityService = require('../services/themeActivityService');

// Get all activities by theme id
exports.listActivitiesByTheme = async (req, res) => {
    try {
        const themeId = req.params.themeId;
        const data = await themeActivityService.listActivitiesByTheme(themeId);

        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No activities found for this theme' });
        }

        return res.status(200).json({ 'activities': data });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};


// Get first five activities by theme id
exports.getFirstFiveActivitiesByTheme = async (req, res) => {
    try {
        const themeId = req.params.themeId;
        const data = await themeActivityService.getFirstFiveActivitiesByTheme(themeId);
        return res.status(200).json({ 'activities': data });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

