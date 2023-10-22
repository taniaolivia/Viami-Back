const db = require("../knex");

// Get a list of languages
exports.listAllLanguages = (req, res) => {
    db("language")
        .select("*")
        .orderBy("language", "asc")
        .then(data => res.status(200).json({"languages": data}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });
}

// Get a language by id
exports.getLanguageById = (req, res) => {
    let id = req.params.languageId;

    db("language")
        .select("*")
        .where({id: id})
        .then(data => res.status(200).json({data}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });
}
