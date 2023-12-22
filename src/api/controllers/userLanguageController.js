const db = require("../knex");

// Get all languages with their users
exports.getAllUsersLanguages = (req, res) => {
    db("user_language")
        .select("*")
        .join("user", "user.id", "=", "user_language.userId")
        .join("language", "language.id", "=", "user_language.languageId")
        .then(data => res.status(200).json({data}))
        .catch(error => {
            res.status(401);     
            res.json({message: "Server error"});
        });
}

// Get all languages of a user by id
exports.getUserLanguagesById = (req, res) => {
    let id = req.params.userId;

    db("user_language")
        .select("*")
        .where({userId: id})
        .join("user", "user.id", "=", "user_language.userId")
        .join("language", "language.id", "=", "user_language.languageId")
        .then(data => res.status(200).json({"userLanguages": data}))
        .catch(error => {
            res.status(401);
            res.json({message: "Server error"});
        });
}

// Get all users with the same language by id
exports.getLanguageUsersById = (req, res) => {
    let id = req.params.languageId;

    db("user_language")
        .select("*")
        .where({languageId: id})
        .join("user", "user.id", "=", "user_language.userId")
        .join("language", "language.id", "=", "user_language.languageId")
        .then(data =>
             res.status(200).json({"userLanguages": data}
        ))
        .catch(error => {
            res.status(401);
            res.json({message: "Server error"});
        });
}

// Add language to user's data
exports.addUserLanguage = (req, res) => {
    let language = req.body.languageId;
    let user = req.params.userId;

    db("user_language")
        .insert({
            languageId: language,
            userId: user
        })
        .then(data => {
            db("user")
                .select("*")
                .where({id: user})
                .then(userData => {
                    db("language")
                        .select("*")
                        .where({id: language})
                        .then(languageData => {
                            res.status(200).json({
                                message: `Language is added to user's data`,
                                user: userData,
                                language: languageData
                            })
                    })
                })
        })
        .catch(error => {
            res.status(401);  
            res.json({message: "Invalid request"});
        })
}

// Delete a language in user's data
exports.deleteUserLanguage = (req, res) => {
    let language = req.body.languageId;
    let user = req.params.userId;

    db("user_language")
        .delete("*")
        .where({
            languageId: language,
            userId: user
        })
        .then(data => {
            res.status(200).json({
                message: `Language is deleted from user's data`,
            });
        })
        .catch(error => {
            res.status(401);
            res.json({message: "Invalid request"});
        })
}