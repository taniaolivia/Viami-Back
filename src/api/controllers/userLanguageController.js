const db = require("../knex");
const userLanguageService = require("../services/userLanguageService");


// Get all languages with their users
exports.getAllUsersLanguages = async (req, res) => {
    try {
        const data = await userLanguageService.getAllUsersLanguages();
        res.status(200).json({ data });
    } catch (error) {
        res.status(401).json({ message: "Server error" });
    }
};

// Get all languages of a user by id

exports.getUserLanguagesById = async (req, res) => {
    try {
        let id = req.params.userId;
        const data = await userLanguageService.getUserLanguagesById(id);
        res.status(200).json({"userLanguages": data});
    } catch (error) {
        res.status(401).json({ message: "Server error" });
    }
};

// Get all users with the same language by id
exports.getLanguageUsersById = async (req, res) => {
    try {
        let id = req.params.languageId;
        const data = await userLanguageService.getLanguageUsersById(id);
        res.status(200).json({"userLanguages": data});
    } catch (error) {
        res.status(401).json({ message: "Server error" });
    }
};

// Add language to user's data
exports.addUserLanguage = async (req, res) => {
    let language = req.body.languageId;
    let user = req.params.userId;

    try {
        const data = await userLanguageService.addUserLanguage(user, language);
        res.status(200).json(data);
    } catch (error) {
        res.status(401).json({ message: 'Invalid request' });
    }
};



// Delete a language in user's data
exports.deleteUserLanguage = async (req, res) => {
    let language = req.body.languageId;
    let user = req.params.userId;

    try {
        const data = await userLanguageService.deleteUserLanguage(user, language);
        res.status(200).json(data);
    } catch (error) {
        res.status(401).json({ message: 'Invalid request' });
    }
};