const db = require("../knex");

exports.getAllUsersLanguages = async () => {
    try {
        const languages = await db("user_language")
            .select("*")
            .join("user", "user.id", "=", "user_language.userId")
            .join("language", "language.id", "=", "user_language.languageId");
        return languages;
    } catch (error) {
        throw new Error("Failed to fetch users' languages");
    }
};


exports.getUserLanguagesById = async (userId) => {
    try {
        const userLanguages = await db("user_language")
            .select("*")
            .where({ userId: userId })
            .join("user", "user.id", "=", "user_language.userId")
            .join("language", "language.id", "=", "user_language.languageId");

        return userLanguages;
    } catch (error) {
        throw new Error("Failed to get user languages by id");
    }
};

exports.getLanguageUsersById = async (languageId) => {
    try {
        const users = await db("user_language")
            .select("*")
            .where({ languageId: languageId })
            .join("user", "user.id", "=", "user_language.userId")
            .join("language", "language.id", "=", "user_language.languageId");

        return users;
    } catch (error) {
        throw new Error("Failed to get users with the same language by id");
    }
};

exports.addUserLanguage = async (userId, languageId) => {
    try {
        await db("user_language")
            .insert({
                languageId: languageId,
                userId: userId
            });

        const userData = await db('user').select('*').where({ id: userId });

        const languageData = await db('language').select('*').where({ id: languageId });

        return { message: `Language is added to user's data`, user: userData, language: languageData };
    } catch (error) {
        throw new Error('Invalid request');
    }
};

exports.deleteUserLanguage = async (userId, languageId) => {
    try {
        await db("user_language")
            .delete("*")
            .where({
                languageId: languageId,
                userId: userId
            });
        return { message: "Language is deleted from user's data" };
    } catch (error) {
        throw new Error("Invalid request");
    }
};
