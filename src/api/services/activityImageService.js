const db = require("../knex");

exports.getAllActivitiesImages = () => {
    return db('activity_image')
        .select([
            "activity_image.id as id",
            "activity_image.idImage as idImage",
            "activity_image.idActivity as idActivity",
            "activity.name as name",
            "activity.description as description",
            "activity.location as location",
            "activity.nbParticipant as nbParticipant",
            "activity.isRecommended as isRecommended",
            "activity.imageName as imageName",
            "activity.url as url",
            "activity.telephone as telephone",
            "activity.address as address",
            "activity.latitude as latitude",
            "activity.longitude as longitude",
            "activity.schedule as schedule",
            "activity.language as language",
            "activity.accessibility as accessibility",
            "image.image as image",
            "activity.note as note"
        ])
        .join("activity", "activity.id", "=", "activity_image.idActivity")
        .join("image", "image.id", "=", "activity_image.idImage");
};


exports.getActivityImagesById = (activityId) => {
    return db('activity_image')
        .select([
            "activity_image.id as id",
        "activity_image.idImage as idImage",
        "activity_image.idActivity as idActivity",
        "activity.name as name",
        "activity.description as description",
        "activity.location as location",
        "activity.nbParticipant as nbParticipant",
        "activity.isRecommended as isRecommended",
        "activity.imageName as imageName",
        "activity.url as url",
        "activity.telephone as telephone",
        "activity.address as address",
        "activity.latitude as latitude",
        "activity.longitude as longitude",
        "activity.schedule as schedule",
        "activity.language as language",
        "activity.accessibility as accessibility",
        "image.image as image",
        "activity.note as note"
        ])
        .where({ idActivity: activityId })
        .join("activity", "activity.id", "=", "activity_image.idActivity")
    .join("image", "image.id", "=", "activity_image.idImage");
};

exports.addImageToActivity = async (image, activityId) => {
    try {
        const imageId = await db('image').insert(image).returning('id');
        await db('activity_image').insert({ idImage: imageId[0], idActivity: activityId });
        const activityData = await db('activity').select("*").where({ id: activityId });
        return { imageId: imageId[0], activityData };
    } catch (error) {
        throw new Error('Invalid request');
    }
};

exports.deleteActivityImage = async (imageId, activityId) => {
    try {
        await db('activity_image')
            .delete()
            .where({
                idImage: imageId,
                idActivity: activityId
            });

        await db('image')
            .delete()
            .where({
                id: imageId
            });
    } catch (error) {
        throw error;
    }
};