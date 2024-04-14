
const db = require("../knex");

exports.listAllImages = async () => {
    try {
        const data = await db("image").select("*");
        return { images: data };
    } catch (error) {
        throw new Error("Server error");
    }
};

exports.getImageById = async (imageId) => {
    try {
        const image = await db('image').select('*').where({ id: imageId }).first();
        return image;
    } catch (error) {
        throw new Error('Failed to fetch image by id');
    }
};

