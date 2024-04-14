const themeService = require('../services/themeService');

// Get all themes ordered ascending by theme name
exports.listThemes = async (req, res) => {
    try {
        const data = await themeService.listThemes();
        res.status(200).json( {'themes' : data } );
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get five themes ordered ascending by theme name
exports.getFiveThemes = async (req, res) => {
    try {
        const data = await themeService.getFiveThemes();
        res.status(200).json({ 'themes' : data });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};