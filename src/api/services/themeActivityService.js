const db = require("../knex");

exports.listActivitiesByTheme = (themeId) => {
    return db("theme_activity")
        .select("*")
        .where("themeId", themeId)
        .join("activity", "activity.id", "=", "theme_activity.activityId")
        .join("theme", "theme.id", "=", "theme_activity.themeId")
        .orderBy("activity.name", "asc");
};



exports.getFirstFiveActivitiesByTheme = async (themeId) => {
    try {
        const data = await db("theme_activity")
            .select("*")
            .where("themeId", themeId)
            .join("activity", "activity.id", "=", "theme_activity.activityId")
            .join("theme", "theme.id", "=", "theme_activity.themeId")
            .orderBy("activity.name", "asc")
            .limit(5)
            .offset(0);
        return data;
    } catch (error) {
        throw new Error('Database error');
    }
};