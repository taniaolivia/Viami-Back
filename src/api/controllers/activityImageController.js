
const db = require("../knex");

// Get all images with their activities
exports.getAllActivitiesImages = (req, res) => {
    db("activity_image")
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
        .join("image", "image.id", "=", "activity_image.idImage")
        .then(data => res.status(200).json({data}))
        .catch(error => {
            res.status(401);
          
            res.json({message: "Server error"});
        });
}

// Get all images of an activity by id
exports.getActivityImagesById = (req, res) => {
    let id = req.params.activityId;

    db("activity_image")
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
    .where({idActivity: id})
    .join("activity", "activity.id", "=", "activity_image.idActivity")
    .join("image", "image.id", "=", "activity_image.idImage")
    .then(data => res.status(200).json({"activityImages": data}))
    .catch(error => {
        res.status(401);
        
        res.json({message: "Server error"});
    });

}


// Add image to activity's data
exports.addImageToActivity = (req, res) => {
    let image = req.body.image;
    let activityId = req.params.activityId;

    db("image")
        .insert(image)
        .then(data => {
            db("activity_image")
                .insert({
                    idImage: data[0],
                    idActivity: activityId
                })
                .then(activityActivity => {
                    db("activity")
                        .select("*")
                        .where({id: activityId})
                        .then(activityData => {
                            res.status(200).json({
                                message: `Image is added to activity's data`,
                                activity: activityData,
                                image: {
                                    id: data[0],
                                    image: image
                                }
                            }) 
                        })
                })
                .catch(error => {
                    res.status(401);
                  
                    res.json({message: "Invalid request"});
                })
        })
        .catch(error => {
            res.status(401);
           
            res.json({message: "Invalid request"});
        });
}

// Delete an image in activity's data
exports.deleteActivityImage = (req, res) => {
    let image = req.body.imageId;
    let activity = req.params.activityId;

    db("activity_image")
        .delete("*")
        .where({
            idImage: image,
            idActivity: activity
        })
        .then(data => {
            db("image")
                .delete("*")
                .where({
                    id: image
                })
                .then(data => {
                    res.status(200).json({
                        message: `Image is deleted from activity's data`,
                    });
                })
                .catch(error => {
                    res.status(401);
                    
                    res.json({message: "Invalid request"});
                })
        })
        .catch(error => {
            res.status(401);
           
            res.json({message: "Invalid request"});
        })
}
