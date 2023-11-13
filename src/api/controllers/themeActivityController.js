const db = require("../knex");

// Get all activities by theme id
exports.listActivitiesByTheme = (req, res) => {
    const themeId = req.params.themeId;

    db("theme_activity")
        .select("*")
        .where("themeId", themeId)
        .join("activity", "activity.id", "=", "theme_activity.activityId")
        .join("theme", "theme.id", "=", "theme_activity.themeId")
        .orderBy("activity.name", "asc")
        .then(data => res.status(200).json({'activities' : data }))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({ message: "Server error" });
        });
}

// Get first five activities by theme id
exports.getFirstFiveActivitiesByTheme = (req, res) => {
    const themeId = req.params.themeId;

    db("theme_activity")
        .select("*")
        .where("themeId", themeId)
        .join("activity", "activity.id", "=", "theme_activity.activityId")
        .join("theme", "theme.id", "=", "theme_activity.themeId")
        .orderBy("activity.name", "asc")
        .limit(5)
        .offset(0)
        .then(data => res.status(200).json({'activities' : data }))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({ message: "Server error" });
        });
}

