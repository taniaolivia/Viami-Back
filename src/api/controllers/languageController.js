const db = require("../knex");
const languageService = require('../services/languageService');

// Get a list of languages
exports.listAllLanguages = async (req, res) => {
    try {
        const data = await languageService.getAllLanguages();
        res.status(200).json({ "languages": data });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get a language by id
exports.getLanguageById = async (req, res) => {
    try {
        const languageId = req.params.languageId;
        const data = await languageService.getLanguageById(languageId);
        if (!data) {
            return res.status(404).json({ message: 'Language not found' });
        }
        return res.status(200).json({ data });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};