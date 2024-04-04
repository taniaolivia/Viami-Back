const db = require("../knex");

exports.getTravelById = async (id) => {
    try {
        const data = await db("travel").select("*").where("id", id);
        return data;
    } catch (error) {
        throw new Error("Server error");
    }
};

exports.searchTravels = async (location) => {
    try {
        const data = await db("travel").select("*").where("location", location).orderBy("name", "asc");
        return data;
    } catch (error) {
        throw new Error("Server error");
    }
};



exports.listAllTravels = async () => {
    try {
        const data = await db("travel").select("*").orderBy("name", "asc");
        return data;
    } catch (error) {
        throw new Error("Server error");
    }
};

exports.saveNewTravel = async (name, description, location) => {
    try {
        if (!name || !description || !location) {
            throw new Error("Please provide all the required fields (name, description, and location)");
        }

        await db("travel").insert({
            name: name,
            description: description,
            location: location,
            nbParticipant: 0 
        });

        return { message: "New travel is successfully saved." };
    } catch (error) {
        throw new Error("Error while saving the new travel.");
    }
};
