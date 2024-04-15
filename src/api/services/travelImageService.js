const db = require('../knex');

exports.getAllTravelsImages = async () => {
    try {
        const travelsImages = await db("travel_image")
            .select([
                "travel_image.id as id",
                "travel_image.idImage as idImage",
                "travel_image.idTravel as idTravel",
                "travel.name as name",
                "travel.description as travelDescription",
                "travel.location as location",
                "travel.nbParticipant as nbParticipant",
                "image.image as imageName",
            ])
            .join("travel", "travel.id", "=", "travel_image.idTravel")
            .join("image", "image.id", "=", "travel_image.idImage");

        return travelsImages;
    } catch (error) {
        throw new Error("Failed to get all travels images");
    }
};


exports.getTravelImagesById = async (travelId) => {
    try {
        const travelImages = await db("travel_image")
            .select([
                "travel_image.id as id",
                "travel_image.idImage as idImage",
                "travel_image.idTravel as idTravel",
                "travel.name as name",
                "travel.description as travelDescription",
                "travel.location as location",
                "travel.nbParticipant as nbParticipant",
                "image.image as imageName",
            ])
            .where("idTravel", travelId)
            .join("travel", "travel.id", "=", "travel_image.idTravel")
            .join("image", "image.id", "=", "travel_image.idImage");
        
        return travelImages;
    } catch (error) {
        throw new Error("Failed to get travel images by id");
    }
};


exports.addImageToTravel = async (image, travelId) => {
    try {
        const imageData = await db("image").insert({ image });
        const idImage = imageData[0];

        await db("travel_image").insert({ idImage: idImage, idTravel: travelId });

        return { idImage, image };
    } catch (error) {
        throw new Error("Failed to add image to travel's data");
    }
};

exports.deleteTravelImage = async (imageId, travelId) => {
    try {
        await db("travel_image").delete("*").where({ idImage: imageId, idTravel: travelId });

        await db("image").delete("*").where({ id: imageId });

        return { message: "Image is deleted from travel's data" };
    } catch (error) {
        throw new Error("Failed to delete image from travel's data");
    }
};
