
const db = require("../knex");

// Get all languages
exports.getAllLanguages = async () => {
    try {
        const languages = await db('language').select('*').orderBy('language', 'asc');
        return languages;
    } catch (error) {
        throw new Error('Database error');
    }
};



exports.getLanguageById = async (id) => {
    try {
        const language = await db("language")
            .select("*")
            .where({ id })
            .first();
        return language;
    } catch (error) {
        throw new Error('Database error');
    }
};