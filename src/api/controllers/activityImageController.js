
const db = require("../knex");

// Get all images with their activity
exports.getAllActivitiesImages = (req, res) => {
    db("activity_image")
        .select([
            "activity_image.id as id",
            "activity_image.idImage as idImage",
            "activity_image.idActivity as idActivity",
            "activity.name as name",
            "activity.description as activityDescription",
            "activity.location as location",
            "activity.note as note",
            "image.image as imageName",
            
        ])
        .join("activity", "activity.id", "=", "activity_image.idActivity")
        .join("image", "image.id", "=", "activity_image.idImage")
        .then(data => res.status(200).json({data}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });
}

// Get all images of a activity by id
exports.getActivityImagesById = (req, res) => {
    let id = req.params.activityId;

    db("activity_image")
    .select([
        "activity_image.id as id",
            "activity_image.idImage as idImage",
            "activity_image.idActivity as idActivity",
            "activity.name as name",
            "activity.description as activityDescription",
            "activity.imageName as imageName " ,
            "activity.location as location",
            "activity.note as note",
            "image.image as imageName",
    ])
    .where({idActivity: id})
    .join("activity", "activity.id", "=", "activity_image.idActivity")
    .join("image", "image.id", "=", "activity_image.idImage")
    .then(data => res.status(200).json({"activityImages": data}))
    .catch(error => {
        res.status(401);
        console.log(error);
        res.json({message: "Server error"});
    });

}
