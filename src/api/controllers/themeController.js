const db = require("../knex");

// Get all themes ordered ascending by theme name
exports.listThemes= (req, res) => {
    db("theme")
        .select("*")
        .orderBy("theme", "asc")
        .then(data => res.status(200).json({'themes' : data }))
        .catch(error => {
            res.status(401); 
            res.json({ message: "Server error" });
        });
}

// Get five themes ordered ascending by theme name
exports.getFiveThemes= (req, res) => {
    db("theme")
        .select("*")
        .orderBy("theme", "asc")
        .limit(5)
        .offset(0)
        .then(data => res.status(200).json({'themes' : data }))
        .catch(error => {
            res.status(401);
            res.json({ message: "Server error" });
        });
}