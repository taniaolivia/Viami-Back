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

exports.getDateLocationUsers = async (location, date) => {
    try {
        const data = await db("date_location")
            .select("*")
            .where("location", location)
            .where("date", date)
            .orderBy("date", "asc");

        if (data.length === 0) {
            throw new Error("There's no participant yet for this travel");
        }

        const user = await db("user_date_location")
            .select("*")
            .where("dateLocationId", data[0].id)
            .join("user", "user.id", "=", "user_date_location.userId")
            .join("date_location", "date_location.id", "=", "user_date_location.dateLocationId")
            .orderBy("user.firstName", "asc");

        return {
            nbParticipant: user.length,
            users: user
        };
    } catch (error) {
        throw new Error("Failed to get date location users");
    }
};