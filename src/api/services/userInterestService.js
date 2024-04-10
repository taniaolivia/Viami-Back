const db = require("../knex");

exports.getAllUsersInterests = async () => {
    try {
        const interests = await db("user_interest")
            .select("*")
            .join("user", "user.id", "=", "user_interest.userId")
            .join("interest", "interest.id", "=", "user_interest.interestId");

        return interests;
    } catch (error) {
        throw new Error("Server error");
    }
};

exports.getInterestUsersById = async (interestId) => {
    try {
        const userInterests = await db("user_interest")
            .select("*")
            .where({interestId: interestId})
            .join("user", "user.id", "=", "user_interest.userId")
            .join("interest", "interest.id", "=", "user_interest.interestId")

        return userInterests;
    } catch (error) {
        throw new Error("Server error");
    }
};

exports.getUserInterestsById = async (userId) => {
    try {
        const userInterests = await db("user_interest")
            .select("*")
            .where({ userId : userId })
            .join("user", "user.id", "=", "user_interest.userId")
            .join("interest", "interest.id", "=", "user_interest.interestId");

        return userInterests;
    } catch (error) {
        throw new Error("Server error");
    }
};

exports.addUserInterest = async (userId, interestId) => {
    try {
        const [data] = await db("user_interest").insert({ interestId, userId });
        const userData = await db("user").select("*").where({ id: userId });
        const interestData = await db("interest").select("*").where({ id: interestId });
        
        return { message: "Interest is added to user's data", user: userData,
        interest: interestData  };
    } catch (error) {
        throw new Error("Failed to add interest to user's data");
    }
};

exports.deleteUserInterest = async (userId, interestId) => {
    try {
        await db("user_interest")
            .delete()
            .where({
                userId: userId,
                interestId: interestId
            });
        return { message: "Interest is deleted from user's data" };
    } catch (error) {
        throw new Error("Failed to delete user interest");
    }
};