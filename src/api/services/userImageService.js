const db = require("../knex");

exports.getAllUsersImages = async () => {
    try {
        const usersImages = await db("user_image")
            .select("*")
            .join("user", "user.id", "=", "user_image.userId")
            .join("image", "image.id", "=", "user_image.imageId");
        return usersImages ;
    } catch (error) {
        throw new Error("Failed to fetch users' images");
    }
};


exports.getUserImagesById = async (userId) => {
    try {
        const userImages = await db("user_image")
            .select("*")
            .where({userId: userId})
            .join("user", "user.id", "=", "user_image.userId")
            .join("image", "image.id", "=", "user_image.imageId");

        return userImages;
    } catch (error) {
        throw new Error("Failed to get user's images by id");
    }
};
