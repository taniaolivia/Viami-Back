const db = require("../knex");

exports.getAllFaq = () => {
    return db("faq")
        .select("*")
        .orderBy("question", "asc");
};

exports.getTopFiveFrequentedFaq = async () => {
    try {
        const data = await db("faq")
            .select("*")
            .where("isFrequented", 1)
            .orderBy("question", "asc")
            .limit(5)
            .offset(0);
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Database error");
    }
};
