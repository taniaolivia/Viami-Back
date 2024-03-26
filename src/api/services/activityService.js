const db = require("../knex");

exports.fetchAllActivities = () => {
    return db("activity")
        .select("*")
        .orderBy("name", "asc");
}


exports.findActivityById = (id) => {
    return db('activity')
        .select('*')
        .where('id', id);
}

exports.saveActivity = (activity) => {
    return db('activity').insert(activity);
};

exports.findRecommendedActivities = () => {
    return db("activity")
        .select("*")
        .where("isRecommended", 1)
        .orderBy("name", "asc");
};

exports.findPopularActivities = () => {
    return db('activity')
        .select('*')
        .orderBy('nbParticipant', 'desc')
        .orderBy('name', 'asc');
};

exports.findTopFivePopularActivities = () => {
    return db('activity')
        .select('*')
        .orderBy('nbParticipant', 'desc')
        .orderBy('name', 'asc')
        .limit(5)
        .offset(0); // Inclu pour clarifier que la récupération commence à partir de la première ligne
};

exports.findTopFiveRecommendedActivities = () => {
    return db('activity')
        .select('*')
        .where('isRecommended', 1)
        .orderBy('name', 'asc')
        .limit(5)
        .offset(0);
};

exports.findRecommendedActivityById = (id) => {
    return db('activity')
        .select('*')
        .where('id', id);
};

exports.updateActivityNote = (id, newNote) => {
    return db("activity")
        .update({ note: newNote })
        .where('id', id);
};

// Function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = EARTH_RADIUS * c;

    return distance;
}

// Fonction pour filtrer les activités en fonction de la distance par rapport à la position de l'utilisateur
const filterActivitiesByDistance = (activities, userLat, userLon) => {
    const nearbyActivities = activities.filter(activity => {
        const distance = calculateDistance(userLat, userLon, activity.latitude, activity.longitude);
        return distance <= 50;
    });
    return nearbyActivities;
};

// Function to retrieve all activities near the user's location
exports.getAllActivitiesByUserPosition = async (userLat, userLon) => {
    try {
        const activities = await db("activity").select("*");
        return filterActivitiesByDistance(activities, userLat, userLon);
    } catch (error) {
        throw new Error("Activity not found");
    }
};


