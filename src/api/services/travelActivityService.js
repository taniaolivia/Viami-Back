// travelActivityService.js

const db = require('../knex');

exports.getAllTravelsActivities = async () => {
    try {
        const data = await db("travel_activity")
        .select([
            "travel_activity.id as id",
            "travel_activity.idActivity as idActivity",
            "travel_activity.idTravel as idTravel",
            "travel.name as name",
            "travel.description as travelDescription",
            "travel.location as location",
            "travel.nbParticipant as nbParticipant",
            "activity.name as activityName",
            "activity.imageName as imageName",
            "activity.location as activityLocation",
            "activity.isRecommended as isRecommended",
            "activity.nbParticipant as activityNbParticipant",
            "activity.url as activityUrl",
            "activity.telephone as activityTelephone",
            "activity.address as activityAddress",
            "activity.latitude as activityLatitude",
            "activity.longitude as activityLongitude",
            "activity.schedule as activitySchedule",
            "activity.language as activityLanguage",
            "activity.accessibility as accessibility"
        ])
        .join("travel", "travel.id", "=", "travel_activity.idTravel")
        .join("activity", "activity.id", "=", "travel_activity.idActivity");
        return data;
    } catch (error) {
        throw new Error('Database error');
    }
};

exports.getTravelActivitiesById = async (travelId) => {
    try {
        const data = await db("travel_activity")
        .select([
            "travel_activity.id as id",
            "travel_activity.idActivity as idActivity",
            "travel_activity.idTravel as idTravel",
            "travel.name as name",
            "travel.description as travelDescription",
            "travel.location as location",
            "travel.nbParticipant as nbParticipant",
            "activity.name as activityName",
            "activity.imageName as imageName",
            "activity.location as activityLocation",
            "activity.isRecommended as isRecommended",
            "activity.nbParticipant as activityNbParticipant",
            "activity.url as activityUrl",
            "activity.telephone as activityTelephone",
            "activity.address as activityAddress",
            "activity.latitude as activityLatitude",
            "activity.longitude as activityLongitude",
            "activity.schedule as activitySchedule",
            "activity.language as activityLanguage",
            "activity.accessibility as accessibility"
        ])
        .where({idTravel: id})
        .join("travel", "travel.id", "=", "travel_activity.idTravel")
        .join("activity", "activity.id", "=", "travel_activity.idActivity");
        return data;
    } catch (error) {
        throw new Error('Database error');
    }
};

exports.addActivityToTravel = async (activity, travelId) => {
    try {
        const [activityId] = await db('activity').insert(activity);
        await db('travel_activity').insert({
            idActivity: activityId,
            idTravel: travelId
        });
        const travelData = await db('travel').select('*').where({ id: travelId });
        return { message: 'Activity is added to travel\'s data', travel: travelData, activity: activity };
    } catch (error) {
        throw new Error('Invalid request');
    }
};

exports.deleteTravelActivity = async (activityId, travelId) => {
    try {
        await db('travel_activity').delete('*').where({ idActivity: activityId, idTravel: travelId });
        await db('activity').delete('*').where({ id: activityId });
        return { message: 'Activity is deleted from travel\'s data' };
    } catch (error) {
        throw new Error('Invalid request');
    }
};
