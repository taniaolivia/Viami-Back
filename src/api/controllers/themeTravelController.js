const db = require("../knex");

// Get all themes ordered ascending by theme name
exports.listThemes= (req, res) => {
    db("theme")
        .select("*")
        .orderBy("theme", "asc")
        .then(data => res.status(200).json({'themes' : data }))
        .catch(error => {
            res.status(401);
            console.log(error);
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
            console.log(error);
            res.json({ message: "Server error" });
        });
}

// Get all travels by theme id
exports.listTravelsByTheme = (req, res) => {
    const themeId = req.params.themeId;

    db("theme_travel")
        .select("*")
        .where("themeId", themeId)
        .join("travel", "travel.id", "=", "theme_travel.travelId")
        .join("theme", "theme.id", "=", "theme_travel.themeId")
        .orderBy("travel.name", "asc")
        .then(data => res.status(200).json({'travels' : data }))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({ message: "Server error" });
        });
}

// Get first five travels by theme id
exports.getFirstFiveTravelsByTheme = (req, res) => {
    const themeId = req.params.themeId;

    db("theme_travel")
        .select("*")
        .where("themeId", themeId)
        .join("travel", "travel.id", "=", "theme_travel.travelId")
        .join("theme", "theme.id", "=", "theme_travel.themeId")
        .orderBy("travel.name", "asc")
        .limit(5)
        .offset(0)
        .then(data => res.status(200).json({'travels' : data }))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({ message: "Server error" });
        });
}

